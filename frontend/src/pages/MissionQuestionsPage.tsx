import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuestionsByMission } from "../hooks/useQuestions";
import { useMissionResult } from "../hooks/useMissionResult";
import { useSubmitMission } from "../hooks/useSubmitMission";
import { Spinner } from "../components/ui/Spinner";
import { ErrorState } from "../components/ui/States";
import { Card } from "../components/ui/Card";

export function MissionQuestionsPage() {
  const { missionId } = useParams();

  const id = Number(missionId);

  const navigate = useNavigate();

  const questionsQuery = useQuestionsByMission(id);
  const missionResultQuery = useMissionResult(id);
  const submitMission = useSubmitMission();

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

  async function handleSubmit() {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, optionIds]) => ({
        questionId: Number(questionId),
        optionIds,
      }),
    );

    try {
      await submitMission.mutateAsync({
        missionId: id,
        answers: formattedAnswers,
      });

      // POST saved the result.
      // Now GET reads the saved result from the database.
      await missionResultQuery.refetch();
    } catch {
      // The mutation error is displayed below.
    }
  }

  function handleTryAgain() {
    // Clear selected answers.
    setAnswers({});

    // Remove the old result from the current query.
    // The next render will show the questions again.
    missionResultQuery.remove();
  }

  if (questionsQuery.isLoading || missionResultQuery.isLoading) {
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

  if (missionResultQuery.isError) {
    return (
      <ErrorState
        title="Could not load mission result"
        message="The mission result could not be loaded."
      />
    );
  }

  const questions = questionsQuery.data ?? [];

  const result = missionResultQuery.data;

  if (result) {
    const maxAttempts = 2;

    const canTryAgain = !result.passed && result.attemptsUsed < maxAttempts;

    return (
      <div>
        <button type="button" onClick={() => navigate(-1)}>
          ← Back to lesson
        </button>

        <section className="detail__section">
          <div className="page-header">
            <h1 className="page-header__title">Mission Result</h1>
          </div>

          <Card>
            <h2>{result.passed ? "Mission Passed!" : "Mission Failed"}</h2>

            <p>
              Best Score: <strong>{result.bestScore}%</strong>
            </p>

            <p>
              Attempts Used:{" "}
              <strong>
                {result.attemptsUsed} / {maxAttempts}
              </strong>
            </p>

            <p>
              {result.passed
                ? "Congratulations! You passed this mission."
                : "You did not reach the passing score."}
            </p>

            {canTryAgain && (
              <button type="button" onClick={handleTryAgain}>
                Try Again
              </button>
            )}
          </Card>
        </section>
      </div>
    );
  }

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

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitMission.isPending}
            >
              {submitMission.isPending ? "Submitting..." : "Submit"}
            </button>

            {submitMission.isError && (
              <p>Could not submit the mission. Please try again.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
