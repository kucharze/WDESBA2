let objs = [
  {
    id: number,
    name: string,
  },
  {
    id: number,
    name: string,
    // the ID of the course the assignment group belongs to
    course_id: number,
    // the percentage weight of the entire assignment group
    group_weight: number,
    assignments: [AssignmentInfo],
  },
  {
    id: number,
    name: string,
    // the due date for the assignment
    due_at: "12-24-2023", //date string
    // the maximum points possible for the assignment
    points_possible: number,
  },
  {
    learner_id: number,
    assignment_id: number,
    submission: {
      submitted_at: "12-24-2023",
      score: number,
    },
  },
];
