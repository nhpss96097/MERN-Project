const courseModel = require("../models/course-model");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route 正在接受 request");
  next();
});

/* --------------------------------- 獲得所有課程 --------------------------------- */
router.get("/", async (req, res) => {
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/* ------------------------------- 用講師 id 尋找課程 ------------------------------ */
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let courseFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

/* ------------------------------- 用學生 id 尋找課程 ------------------------------ */
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let courseFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(courseFound);
});

/* ------------------------------- 用課程 id 尋找課程 ------------------------------ */
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/* -------------------------------- 用課程名稱尋找課程 ------------------------------- */
router.get("/findByName/:name", async (req, res) => {
  let { name } = req.params;
  try {
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/* ---------------------------------- 創建課程 ---------------------------------- */
router.post("/", async (req, res) => {
  // 驗證數據
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師才能發佈課程");
  }

  // 創建課程
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send("新課程已經保存");
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

/* ------------------------------ 學生透過課程 id 註冊課程 ------------------------------ */
router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    course.students.push(req.user._id);
    await course.save();
    res.send("註冊完成");
  } catch (e) {
    return res.send(e);
  }
});

/* ---------------------------------- 更改課程 ---------------------------------- */
router.patch("/:_id", async (req, res) => {
  // 驗證數據
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  // 確認課程是否存在
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法更新課程內容");
    }

    // 確認使用者是此課程講師
    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程講師才能編輯");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

/* ---------------------------------- 刪除課程 ---------------------------------- */
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程是否存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程，無法刪除課程");
    }

    // 確認使用者是此課程講師
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除");
    } else {
      return res.status(403).send("只有此課程講師才能刪除");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
