import { useState } from "react";
import type { DiagnosticTest } from "../types/api";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { useSubmitDiagnosticTest } from "../hooks/useSubmitDiagnosticTest";
import { useDiagnosticWeaknesses } from "../hooks/useDiagnosticWeaknesses";

interface DiagnosticTestProps {
  test: DiagnosticTest;
}

export function DiagnosticTest({ test }: DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<number[][]>(() =>
    (test?.questions ?? []).map(() => []),
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitDiagnosticTest = useSubmitDiagnosticTest();
  const findWeaknesses = useDiagnosticWeaknesses();

  if (!test || !test.questions || test.questions.length === 0) {
    return <p>No diagnostic questions available.</p>;
  }

  const question = test.questions[currentQuestionIndex];
  const selectedOptions = answers[currentQuestionIndex] ?? [];

  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  function handleOptionChange(optionIndex: number) {
    setAnswers((currentAnswers) => {
      const newAnswers = [...currentAnswers];

      if (question.type === "SINGLE_CHOICE") {
        newAnswers[currentQuestionIndex] = [optionIndex];
      } else {
        const currentSelected = newAnswers[currentQuestionIndex] ?? [];

        if (currentSelected.includes(optionIndex)) {
          newAnswers[currentQuestionIndex] = currentSelected.filter(
            (index) => index !== optionIndex,
          );
        } else {
          newAnswers[currentQuestionIndex] = [...currentSelected, optionIndex];
        }
      }

      return newAnswers;
    });
  }

  async function handleNext() {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((current) => current + 1);
      return;
    }

    const formattedAnswers = test.questions.map((question, questionIndex) => {
      const selectedIndexes = answers[questionIndex] ?? [];

      return {
        questionId: question.id,
        selectedOptionIds: selectedIndexes.map(
          (index) => question.options[index].id,
        ),
      };
    });

    try {
      await submitDiagnosticTest.mutateAsync({
        testId: test.id,
        answers: formattedAnswers,
      });

      setIsSubmitted(true);
    } catch {
      // Error is shown below.
    }
  }

  async function handleFindWeaknesses() {
    try {
      await findWeaknesses.mutateAsync(test.id);
    } catch {
      // Error is shown below.
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex === 0) return;

    setCurrentQuestionIndex((current) => current - 1);
  }

  // --------------------------------
  // Test submitted
  // --------------------------------

  if (isSubmitted && !findWeaknesses.data) {
    return (
      <div style={{ marginTop: "var(--space-4)" }}>
        <h3>Diagnostic Test Completed</h3>

        <p>Your answers have been submitted successfully.</p>

        <Button
          onClick={handleFindWeaknesses}
          disabled={findWeaknesses.isPending}
        >
          {findWeaknesses.isPending
            ? "Finding your weaknesses..."
            : "Find My Weaknesses"}
        </Button>

        {findWeaknesses.isError && (
          <p>Could not analyze your weaknesses. Please try again.</p>
        )}
      </div>
    );
  }

  // --------------------------------
  // Finding weaknesses
  // --------------------------------

  if (findWeaknesses.isPending) {
    return <Spinner center />;
  }

  // --------------------------------
  // Weakness result
  // --------------------------------

  if (findWeaknesses.data) {
    return (
      <div style={{ marginTop: "var(--space-4)" }}>
        <h3>Topics to Review</h3>

        {findWeaknesses.data.length === 0 && (
          <p>Great job! No weaknesses were found in your diagnostic test.</p>
        )}

        {findWeaknesses.data.map((weakness) => (
          <div
            key={weakness.outcomeId}
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-4)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
            }}
          >
            {/* Learning Outcome */}

            <h4>{weakness.learningOutcome}</h4>

            {/* Remediations */}

            {weakness.remediations.map((remediation, index) => (
              <div key={index}>
                {/* Wrong Questions */}

                {remediation.explanations.map((item) => (
                  <div
                    key={item.questionId}
                    style={{
                      marginTop: "var(--space-3)",
                      padding: "var(--space-3)",
                      background: "var(--surface-secondary)",
                      borderRadius: "8px",
                    }}
                  >
                    <strong>{item.question}</strong>

                    <div
                      style={{
                        marginTop: "var(--space-2)",
                      }}
                    >
                      <strong>Your answer</strong>

                      {item.selectedAnswers.map((answer, answerIndex) => (
                        <p key={answerIndex}>❌ {answer}</p>
                      ))}
                    </div>

                    <div
                      style={{
                        marginTop: "var(--space-2)",
                      }}
                    >
                      <strong>Correct answer</strong>

                      {item.correctAnswers.map((answer, answerIndex) => (
                        <p key={answerIndex}>✓ {answer}</p>
                      ))}
                    </div>

                    <div
                      style={{
                        marginTop: "var(--space-2)",
                      }}
                    >
                      <strong>Why?</strong>

                      <p>{item.explanation}</p>
                    </div>
                  </div>
                ))}

                {/* Teaching */}

                <div
                  style={{
                    marginTop: "var(--space-4)",
                  }}
                >
                  <h4>Learn This</h4>

                  <p>{remediation.teaching.explanation}</p>

                  <strong>Example</strong>

                  <p>{remediation.teaching.example}</p>

                  <strong>Remember</strong>

                  <p>{remediation.teaching.takeaway}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // --------------------------------
  // Diagnostic test
  // --------------------------------

  return (
    <div style={{ marginTop: "var(--space-4)" }}>
      <h3>Diagnostic Test</h3>

      <p>
        Question {currentQuestionIndex + 1} of {test.questions.length}
      </p>

      <div
        style={{
          marginTop: "var(--space-4)",
          padding: "var(--space-4)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
        }}
      >
        <h4>{question.text}</h4>

        <div style={{ marginTop: "var(--space-4)" }}>
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedOptions.includes(optionIndex);

            return (
              <label
                key={option.id}
                style={{
                  display: "block",
                  padding: "var(--space-3)",
                  marginTop: "var(--space-2)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: isSelected
                    ? "var(--surface-secondary)"
                    : "transparent",
                }}
              >
                <input
                  type={
                    question.type === "SINGLE_CHOICE" ? "radio" : "checkbox"
                  }
                  name={`question-${currentQuestionIndex}`}
                  checked={isSelected}
                  onChange={() => handleOptionChange(optionIndex)}
                  style={{
                    marginRight: "var(--space-2)",
                  }}
                />

                {option.text}
              </label>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-2)",
          marginTop: "var(--space-4)",
        }}
      >
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Button onClick={handleNext} disabled={submitDiagnosticTest.isPending}>
          {submitDiagnosticTest.isPending
            ? "Submitting..."
            : isLastQuestion
              ? "Submit Test"
              : "Next"}
        </Button>
      </div>

      {submitDiagnosticTest.isError && (
        <p>Could not submit the diagnostic test. Please try again.</p>
      )}
    </div>
  );
}
