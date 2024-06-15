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

const calculateScores = (score, total) => {
  return score / total;
};

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
      }
    }
  }
  //Assignment is not due yet
  //   console.log("Not due");
  return -1;
};

const getLearnerData = (CourseInfo, AssignmentGroup, LearnerSubmissions) => {
  let studentClassScores = [];

  let assignementInfo = grabImportantAssignmentInfo(AssignmentGroup);

  for (let i = 0; i < LearnerSubmissions.length; i++) {
    let student = {};

    let spot = checkContainment(
      studentClassScores,
      LearnerSubmissions[i].learner_id
    );

    if (spot !== -1) {
      // console.log("New assignment");
      // console.log(LearnerSubmissions[i].assignment_id);

      let assignment = findAssignment(
        assignementInfo,
        LearnerSubmissions[i].assignment_id,
        new Date(LearnerSubmissions[i].submission.submitted_at)
      );
      console.log("assignment return", assignment);

      if (assignment !== -1) {
        //The assignment is due, see if its on time
        studentClassScores[spot].possiblePoints += assignment[0];
        if (assignment[1] == "Late") {
          studentClassScores[spot][LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score - 15;

          studentClassScores[spot].scored +=
            LearnerSubmissions[i].submission.score - 15;
        } else {
          studentClassScores[spot][LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score;

          studentClassScores[spot].scored +=
            LearnerSubmissions[i].submission.score;
        }
        studentClassScores[spot][LearnerSubmissions[i].assignment_id] /=
          assignment[0];
      }
    } else {
      // console.log("Found nothing");
      // New Learner

      student.id = LearnerSubmissions[i].learner_id;
      let assignment = findAssignment(
        assignementInfo,
        LearnerSubmissions[i].assignment_id,
        new Date(LearnerSubmissions[i].submission.submitted_at)
      );
      console.log("assignment return", assignment);

      if (assignment != -1) {
        //The assignment is due, see if its on time
        //add to student array result

        if (assignment[1] == "Late") {
          student[LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score - 15;

          student.scored = LearnerSubmissions[i].submission.score - 15;
          student.possiblePoints = assignment[0];
        } else {
          student[LearnerSubmissions[i].assignment_id] =
            LearnerSubmissions[i].submission.score;

          student.scored = LearnerSubmissions[i].submission.score;
          student.possiblePoints = assignment[0];
        }

        student[LearnerSubmissions[i].assignment_id] /= assignment[0];

        studentClassScores.push(student);
      }
    }
  }

  //   console.log(findAssignment(assignementInfo, 2, new Date("2023-03-01")));

  // console.log(studentClassScores);
  // let d = new Date(AssignmentGroup.assignments[0].due_at);
  // console.log(d);

  return studentClassScores;
};

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
