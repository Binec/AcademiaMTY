import { useParams } from "react-router-dom";
import { CourseLevel } from "../data/site";
import Exam from "../pages/Exam";
import ExamAccessGate from "./ExamAccessGate";

export default function ExamRoute() {
  const { level = "basico" } = useParams();
  const safeLevel = (["basico", "intermedio", "experto", "primeros-auxilios"].includes(level) ? level : "basico") as CourseLevel;

  return (
    <ExamAccessGate level={safeLevel}>
      <Exam />
    </ExamAccessGate>
  );
}
