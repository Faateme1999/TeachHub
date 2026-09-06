import { useNavigate, useParams } from "react-router-dom";
import { useQuestionsByMission } from "../hooks/useQuestions";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/States";
import { Card } from "../components/ui/Card";

export function MissionQuestionsPage() {
  const { missionId } = useParams();
  const id = Number(missionId);
  const navigate = useNavigate();

  const questionsQuery = useQuestionsByMission(id);

  if (questionsQuery.isLoading) {
    return <Spinner center />;
  }

  if (questionsQuery.isError) {
    return (
      <ErrorState
        title="Could not load questions"
        message="The questions for this mission could not be loaded."
      />
    );
  }

  const questions = questionsQuery.data ?? [];

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        ← Back to lesson
      </button>
      <section className="detail__section">
        <div className="page-header">
          <h1 className="page-header__title">Mission Questions</h1>
        </div>

        {questions.length === 0 && (
          <p>No questions available for this mission yet.</p>
        )}

        {questions.length > 0 && (
          <div>
            {questions.map((question) => (
              <Card key={question.id} style={{ marginBottom: "16px" }}>
                <h3>
                  {question.order}. {question.text}
                </h3>

                <ul>
                  {question.options.map((option) => (
                    <li key={option.id}>{option.text}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
