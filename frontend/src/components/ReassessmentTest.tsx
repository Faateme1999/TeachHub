import { useState } from "react";
import { getApiErrorMessage } from "../lib/apiClient";
import { useGenerateReassessmentTest } from "../hooks/useGenerateReassessmentTest";
import { useSubmitReassessmentTest } from "../hooks/useSubmitReassessmentTest";
import type { ReassessmentTest as ReassessmentTestType } from "../types/api";
import { Button } from "./ui/Button";

interface ReassessmentTestProps {
  lessonId: number;
}

export function ReassessmentTest({ lessonId }: ReassessmentTestProps) {
  const generateTest = useGenerateReassessmentTest();
  const submitTest = useSubmitReassessmentTest();

  const [test, setTest] = useState<ReassessmentTestType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  async function handleStartTest() {
    try {
      const result = await generateTest.mutateAsync(lessonId);

      setTest(result);
      setCurrentQuestionIndex(0);
      setAnswers(result.questions.map(() => []));
      setIsSubmitted(false);
      setScore(null);
    } catch {
      // Error is displayed below.
    }
  }

  function handleOptionChange(optionIndex: number) {
    if (!test) return;

    const question = test.questions[currentQuestionIndex];

    setAnswers((currentAnswers) => {
      const updatedAnswers = [...currentAnswers];
      const selectedOptions = updatedAnswers[currentQuestionIndex] ?? [];

      if (question.type === "SINGLE_CHOICE") {
        updatedAnswers[currentQuestionIndex] = [optionIndex];
      } else {
        updatedAnswers[currentQuestionIndex] = selectedOptions.includes(
          optionIndex,
        )
          ? selectedOptions.filter((index) => index !== optionIndex)
          : [...selectedOptions, optionIndex];
      }

      return updatedAnswers;
    });
  }

  async function handleSubmitTest() {
    if (!test) return;

    const formattedAnswers = test.questions.map((question, index) => ({
      questionId: question.id,
      selectedOptionIds: (answers[index] ?? []).map(
        (optionIndex) => question.options[optionIndex].id,
      ),
    }));

    try {
      const result = await submitTest.mutateAsync({
        testId: test.id,
        answers: formattedAnswers,
      });

      setScore(result.score);
      setIsSubmitted(true);
    } catch {
      // Error is displayed below.
    }
  }

  if (isSubmitted) {
    return (
      <section
        style={{
          marginTop: "var(--space-5)",
          padding: "var(--space-4)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
        }}
      >
        <h3>Reassessment Completed</h3>

        <p>Your answers have been submitted successfully.</p>

        {score !== null && (
          <p style={{ marginTop: "var(--space-2)" }}>
            <strong>Your score:</strong> {score}
          </p>
        )}
      </section>
    );
  }

  if (!test) {
    return (
      <section style={{ marginTop: "var(--space-5)" }}>
        <h3>Mission 5: Reassessment Test</h3>

        <p>
          Test your understanding again with questions based on your previous
          mistakes.
        </p>

        <Button onClick={handleStartTest} disabled={generateTest.isPending}>
          {generateTest.isPending
            ? "Preparing Your Test..."
            : "Start Reassessment Test"}
        </Button>

        {generateTest.isError && (
          <p role="alert" style={{ marginTop: "var(--space-3)" }}>
            {getApiErrorMessage(
              generateTest.error,
              "Could not generate the reassessment test. Please try again.",
            )}
          </p>
        )}
      </section>
    );
  }

  if (!test.questions.length) {
    return (
      <section style={{ marginTop: "var(--space-5)" }}>
        <h3>Mission 5: Reassessment Test</h3>
        <p>No reassessment questions are available.</p>
      </section>
    );
  }

  const question = test.questions[currentQuestionIndex];
  const selectedOptions = answers[currentQuestionIndex] ?? [];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  return (
    <section
      style={{
        marginTop: "var(--space-5)",
        padding: "var(--space-4)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
      }}
    >
      <h3>Mission 5: Reassessment Test</h3>

      <p>
        Question {currentQuestionIndex + 1} of {test.questions.length}
      </p>

      <div
        style={{
          marginTop: "var(--space-4)",
          padding: "var(--space-4)",
          background: "var(--surface-2)",
          borderRadius: "8px",
        }}
      >
        <h4>{question.text}</h4>

        <div style={{ marginTop: "var(--space-3)" }}>
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
                  name={`reassessment-question-${question.id}`}
                  checked={isSelected}
                  onChange={() => handleOptionChange(optionIndex)}
                  style={{ marginRight: "var(--space-2)" }}
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
          onClick={() => setCurrentQuestionIndex((current) => current - 1)}
          disabled={currentQuestionIndex === 0 || submitTest.isPending}
        >
          Previous
        </Button>

        {!isLastQuestion ? (
          <Button
            onClick={() => setCurrentQuestionIndex((current) => current + 1)}
            disabled={submitTest.isPending}
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmitTest} disabled={submitTest.isPending}>
            {submitTest.isPending ? "Submitting..." : "Submit Test"}
          </Button>
        )}
      </div>

      {submitTest.isError && (
        <p role="alert" style={{ marginTop: "var(--space-3)" }}>
          {getApiErrorMessage(
            submitTest.error,
            "Could not submit the reassessment test. Please try again.",
          )}
        </p>
      )}
    </section>
  );
}
