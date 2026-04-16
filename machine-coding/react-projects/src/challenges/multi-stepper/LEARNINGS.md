# Learning Gist: Multi-Step Form (Stepper)

### 🧠 The Core Logic
Breaking complex flows into distinct manageable steps with shared state and navigation.

### 🛠️ Implementation Strategy
1. **Current Step State**: Use a number `currentStep`.
2. **Dynamic Components**: Render the component corresponding to the current step.
3. **Guardrails**: Prevent "Next" if current step validation fails.
4. **Final Payload**: Collect data from all steps into a single object for final submission.

### 🚀 FAANG Interview Tips
- **UX**: Mention "Persistent State" (saving drafts to LocalStorage so data isn't lost on refresh).
- **Navigation**: Support "Jump to Step" if the user has already completed/validated it.

```tsx
const [step, setStep] = useState(0);
const components = [<Step1 />, <Step2 />, <Step3 />];
return (
  <div>
    {components[step]}
    <button disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
    <button onClick={() => setStep(step + 1)}>Next</button>
  </div>
);
```
