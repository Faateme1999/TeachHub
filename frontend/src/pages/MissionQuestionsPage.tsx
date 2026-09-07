import { useNavigate, useParams } from "react-router-dom";
import { useQuestionsByMission } from "../hooks/useQuestions";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/States";
import { Card } from "../components/ui/Card";
import { useState } from "react";

export function MissionQuestionsPage() {
  const { missionId } = useParams();
  const id = Number(missionId);
  const navigate = useNavigate();

  const questionsQuery = useQuestionsByMission(id);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});

  function handleOptionChange(
    questionId: number,
    optionId: number,
    type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE",
  ) {
    setAnswers((currentAnswers) => {
      const currentSelections = currentAnswers[questionId] ?? [];

      if (type === "SINGLE_CHOICE") {
        return {
          ...currentAnswers,
          [questionId]: [optionId],
        };
      }

      const isSelected = currentSelections.includes(optionId);

      return {
        ...currentAnswers,
        [questionId]: isSelected
          ? currentSelections.filter((id) => id !== optionId)
          : [...currentSelections, optionId],
      };
    });
  }

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
                  {question.options.map((option) => {
                    const isSelected = (answers[question.id] ?? []).includes(
                      option.id,
                    );

                    return (
                      <li key={option.id}>
                        <label>
                          <input
                            type={
                              question.type === "SINGLE_CHOICE"
                                ? "radio"
                                : "checkbox"
                            }
                            name={`question-${question.id}`}
                            checked={isSelected}
                            onChange={() =>
                              handleOptionChange(
                                question.id,
                                option.id,
                                question.type,
                              )
                            }
                          />
                          {option.text}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))}
            <button type="button" onClick={() => console.log(answers)}>
              Submit
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
