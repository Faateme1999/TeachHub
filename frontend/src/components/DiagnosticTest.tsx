import { useState } from "react";
import type { DiagnosticTest } from "../types/api";
import { Button } from "./ui/Button";

interface DiagnosticTestProps {
  test: DiagnosticTest;
}

export function DiagnosticTest({ test }: DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const question = test.questions[currentQuestionIndex];

  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  function handleOptionChange(optionIndex: number) {
    if (question.type === "SINGLE_CHOICE") {
      setSelectedOptions([optionIndex]);
      return;
    }

    setSelectedOptions((current) => {
      if (current.includes(optionIndex)) {
        return current.filter((index) => index !== optionIndex);
      }

      return [...current, optionIndex];
    });
  }

  function handleNext() {
    if (isLastQuestion) {
      console.log("Diagnostic answers:", selectedOptions);
      return;
    }

    setCurrentQuestionIndex((current) => current + 1);
    setSelectedOptions([]);
  }

  function handlePrevious() {
    if (currentQuestionIndex === 0) return;

    setCurrentQuestionIndex((current) => current - 1);
    setSelectedOptions([]);
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
