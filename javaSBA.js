//   {
//     id: number,
//     name: string,
//   },
//   {
//     id: number,
//     name: string,
//     // the ID of the course the assignment group belongs to
//     course_id: number,
//     // the percentage weight of the entire assignment group
//     group_weight: number,
//     assignments: [AssignmentInfo],
//   },
//   {
//     id: number,
//     name: string,
//     // the due date for the assignment
//     due_at: "12-24-2023", //date string
//     // the maximum points possible for the assignment
//     points_possible: number,
//   },
//   {
//     learner_id: number,
//     assignment_id: number,
//     submission: {
//       submitted_at: "12-24-2023", date string
//       score: number,
//     },
//   },

// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function grabImportantAssignmentInfo(assignementInfo) {
  let ids = [];
  let possiblePoints = [];
  let dueDates = [];

  assignementInfo.assignments.forEach((el) => {
    // console.log(el);
    ids.push(el.id);
    if (el.points_possible <= 0) {
      throw new Error(
        "A value less than or equal to 0 was detected for a possible point value"
      );
    }
    console.log(typeof el.points_possible);
    if (typeof el.points_possible !== "number") {
      throw new Error("Points value should be a number");
    }
    possiblePoints.push(el.points_possible);
    dueDates.push(el.due_at);
  });

  return [ids, possiblePoints, dueDates];
}

function checkContainment(scores, id) {
  //   console.log("Checking containment");
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].id == id) {
      return i;
    }
  }

  return -1;
}

const findAssignment = (assignementInfo, id, submitted) => {
  for (let i = 0; i < assignementInfo[0].length; i++) {
    if (assignementInfo[0][i] == id) {
      let dueDate = new Date(assignementInfo[2][i]);
      //   console.log("Duedate", dueDate);
      //   console.log("Submitted", submitted);
      if (dueDate < Date.now()) {
        if (submitted > dueDate) {
          //Assignment submitted late
          //   console.log("Late");
          return [assignementInfo[1][i], "Late"];
        } else {
          //Assignemnt submitteed ontime
          //   console.log("On Time");
          return [assignementInfo[1][i], "On Time"];
        }
      } else {
        //Assignment is not due yet
        //   console.log("Not due");
        return 0;
      }
    }
  }
  //Assignment is not due yet
  //error
  return -1;
};

const calculateAverageScore = (student) => {
  student.forEach((el) => {
    el.avg = el.scored / el.possiblePoints;
    delete el.scored;
    delete el.possiblePoints;
  });
  return 0;
};

const getLearnerData = (CourseInfo, AssignmentGroup, LearnerSubmissions) => {
  let studentClassScores = [];

  try {
    if (CourseInfo.id !== AssignmentGroup.course_id) {
      throw new Error("Course ID Mismatch");
    }
    let assignementInfo = grabImportantAssignmentInfo(AssignmentGroup);

    for (let i = 0; i < LearnerSubmissions.length; i++) {
      let student = {};

      let spot = checkContainment(
        studentClassScores,
        LearnerSubmissions[i].learner_id
      );

      if (typeof LearnerSubmissions[i].submission.score !== "number") {
        throw new Error("Score should be a number");
      }
      if (spot !== -1) {
        // "New assignment"

        let assignment = findAssignment(
          assignementInfo,
          LearnerSubmissions[i].assignment_id,
          new Date(LearnerSubmissions[i].submission.submitted_at)
        );
        // console.log("assignment return", assignment);

        if (assignment == -1) {
          throw new Error("Assignment not found");
        }

        if (assignment !== -0) {
          //The assignment is due, see if its on time
          studentClassScores[spot].possiblePoints += assignment[0];

          let lateScore = 0;
          if (assignment[1] == "Late") {
            lateScore = 15;
          }
          studentClassScores[spot][LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score - lateScore;

          studentClassScores[spot].scored +=
            LearnerSubmissions[i].submission.score - lateScore;

          studentClassScores[spot][LearnerSubmissions[i].assignment_id] /=
            assignment[0];

          //   Math.round(
          //     studentClassScores[spot][LearnerSubmissions[i].assignment_id] * 100
          //   ) / 100;
        }
      } else {
        // New Learner

        student.id = LearnerSubmissions[i].learner_id;
        let assignment = findAssignment(
          assignementInfo,
          LearnerSubmissions[i].assignment_id,
          new Date(LearnerSubmissions[i].submission.submitted_at)
        );
        // console.log("assignment return", assignment);

        if (assignment == -1) {
          throw new Error("Assignment not found");
        }

        if (assignment != -0) {
          //The assignment is due, see if its on time
          //add to student array result

          let lateScore = 0;
          if (assignment[1] == "Late") {
            lateScore = 15;
            student[LearnerSubmissions[i].assignment_id] =
              LearnerSubmissions[i].submission.score - lateScore;

            student.scored = LearnerSubmissions[i].submission.score - lateScore;
            student.possiblePoints = assignment[0];
          }

          student[LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score;

          student.scored = LearnerSubmissions[i].submission.score;
          student.possiblePoints = assignment[0];

          student[LearnerSubmissions[i].assignment_id] /= assignment[0];

          studentClassScores.push(student);
        }
      }
    }

    calculateAverageScore(studentClassScores);

    //   console.log(findAssignment(assignementInfo, 2, new Date("2023-03-01")));

    // console.log(studentClassScores);
    // let d = new Date(AssignmentGroup.assignments[0].due_at);
    // console.log(d);

    return studentClassScores;
  } catch (error) {
    console.log("An error occured", error.message);
    return "Error";
  }
};

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
