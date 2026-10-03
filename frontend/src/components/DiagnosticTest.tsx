import { useState } from "react";
import type { DiagnosticTest } from "../types/api";
import { Button } from "./ui/Button";

interface DiagnosticTestProps {
  test: DiagnosticTest;
}

export function DiagnosticTest({ test }: DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers for all questions.
  // Each item contains the selected option indexes for that question.
  const [answers, setAnswers] = useState<number[][]>(() =>
    test.questions.map(() => []),
  );

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

  function handleNext() {
    if (isLastQuestion) {
      console.log("Diagnostic answers:", answers);
      return;
    }

    setCurrentQuestionIndex((current) => current + 1);
  }

  function handlePrevious() {
    if (currentQuestionIndex === 0) return;

    setCurrentQuestionIndex((current) => current - 1);
  }

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
        <h4>{question.question}</h4>

        <div style={{ marginTop: "var(--space-4)" }}>
          {question.options.map((option, optionIndex) => {
            const isSelected = selectedOptions.includes(optionIndex);

            return (
              <label
                key={optionIndex}
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
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Button onClick={handleNext}>
          {isLastQuestion ? "Submit Test" : "Next"}
        </Button>
      </div>
    </div>
  );
}
