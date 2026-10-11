import { useState } from "react";
import type {
  DiagnosticTest as DiagnosticTestType,
  PracticalAssignmentContent,
} from "../types/api";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { useSubmitDiagnosticTest } from "../hooks/useSubmitDiagnosticTest";
import { useDiagnosticWeaknesses } from "../hooks/useDiagnosticWeaknesses";
import { useGeneratePracticalAssignment } from "../hooks/useLessons";
import { getApiErrorMessage } from "../lib/apiClient";

interface DiagnosticTestProps {
  test: DiagnosticTestType;
  lessonId: number;
}

export function DiagnosticTest({ test, lessonId }: DiagnosticTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<number[][]>(() =>
    (test?.questions ?? []).map(() => []),
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [practicalContent, setPracticalContent] =
    useState<PracticalAssignmentContent | null>(null);

  const submitDiagnosticTest = useSubmitDiagnosticTest();
  const findWeaknesses = useDiagnosticWeaknesses();
  const generatePracticalAssignment = useGeneratePracticalAssignment(lessonId);

  if (!test?.questions?.length) {
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

        newAnswers[currentQuestionIndex] = currentSelected.includes(optionIndex)
          ? currentSelected.filter((index) => index !== optionIndex)
          : [...currentSelected, optionIndex];
      }

      return newAnswers;
    });
  }

  async function handleNext() {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((current) => current + 1);
      return;
    }

    const formattedAnswers = test.questions.map(
      (currentQuestion, questionIndex) => {
        const selectedIndexes = answers[questionIndex] ?? [];

        return {
          questionId: currentQuestion.id,
          selectedOptionIds: selectedIndexes.map(
            (index) => currentQuestion.options[index].id,
          ),
        };
      },
    );

    try {
      await submitDiagnosticTest.mutateAsync({
        testId: test.id,
        answers: formattedAnswers,
      });

      setIsSubmitted(true);
    } catch {
      // The error is displayed below.
    }
  }

  async function handleFindWeaknesses() {
    try {
      await findWeaknesses.mutateAsync(test.id);
    } catch {
      // The error is displayed below.
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((current) => current - 1);
    }
  }

  async function handleGeneratePracticalAssignment() {
    try {
      const assignment = await generatePracticalAssignment.mutateAsync();

      if (!assignment.description) {
        setPracticalContent(null);
        return;
      }

      try {
        const parsed: unknown = JSON.parse(assignment.description);

        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "objective" in parsed &&
          "description" in parsed &&
          "instructions" in parsed &&
          "expectedOutput" in parsed &&
          "evaluationCriteria" in parsed &&
          "hints" in parsed
        ) {
          setPracticalContent(parsed as PracticalAssignmentContent);
        } else {
          setPracticalContent(null);
        }
      } catch {
        setPracticalContent(null);
      }
    } catch {
      // The error is displayed below.
    }
  }

  // 1. Test submitted: ask to analyze weaknesses.

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

  // 2. Analyzing weaknesses.

  if (findWeaknesses.isPending) {
    return <Spinner center />;
  }

  // 3. Display weaknesses and Mission 4.

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
            <h4>{weakness.learningOutcome}</h4>

            {weakness.remediations.map((remediation, index) => (
              <div key={index}>
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

                    <div style={{ marginTop: "var(--space-2)" }}>
                      <strong>Your answer</strong>

                      {item.selectedAnswers.map((answer, answerIndex) => (
                        <p key={answerIndex}>❌ {answer}</p>
                      ))}
                    </div>

                    <div style={{ marginTop: "var(--space-2)" }}>
                      <strong>Correct answer</strong>

                      {item.correctAnswers.map((answer, answerIndex) => (
                        <p key={answerIndex}>✓ {answer}</p>
                      ))}
                    </div>

                    <div style={{ marginTop: "var(--space-2)" }}>
                      <strong>Why?</strong>
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: "var(--space-4)" }}>
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

        {/* Mission 4: Practical Assignment */}

        <section style={{ marginTop: "var(--space-5)" }}>
          <h3>Mission 4: Practical Assignment</h3>

          <p>
            Apply what you learned by completing a practical assignment based on
            your lesson and weaknesses.
          </p>

          <Button
            onClick={handleGeneratePracticalAssignment}
            disabled={generatePracticalAssignment.isPending}
          >
            {generatePracticalAssignment.isPending
              ? "Generating Assignment..."
              : "Generate Practical Assignment"}
          </Button>

          {generatePracticalAssignment.isError && (
            <p>
              {getApiErrorMessage(
                generatePracticalAssignment.error,
                "Could not generate the practical assignment. Please try again.",
              )}
            </p>
          )}

          {generatePracticalAssignment.isSuccess && !practicalContent && (
            <p>
              The assignment was generated, but its content could not be read.
              Please check the response format.
            </p>
          )}

          {practicalContent && (
            <div style={{ marginTop: "var(--space-4)" }}>
              <h4>{practicalContent.objective}</h4>
              <p>{practicalContent.description}</p>

              <strong>Instructions</strong>
              <ol>
                {practicalContent.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>

              <strong>Expected Output</strong>
              <p>{practicalContent.expectedOutput}</p>

              <strong>Evaluation Criteria</strong>
              <ul>
                {practicalContent.evaluationCriteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>

              <strong>Hints</strong>
              <ul>
                {practicalContent.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    );
  }

  // 4. Diagnostic questions.

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
                  name={`question-${question.id}`}
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
