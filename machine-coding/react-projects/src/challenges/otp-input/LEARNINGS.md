# Learning Gist: OTP Input (One Time Password)

### 🧠 The Core Logic
Orchestrating focus and input behavior across multiple separate input fields to create a seamless user experience.

### 🛠️ Implementation Strategy
1. **Array-Based State**: Keep the OTP value as an array (e.g., `['', '', '', '']`) for easy index-based access.
2. **Focus Management**:
   - On value change -> move `focus()` to the next sibling `index + 1`.
   - On `Backspace` -> move `focus()` to the previous sibling `index - 1`.
3. **Pasting Logic**: Implement `onPaste` to split the clipboard text and distribute characters across all inputs.
4. **Validation**: Ensure only numbers are allowed using regex or `type="number"`.

### 🚀 FAANG Interview Tips
- **UX**: Mention "Smart Selection" (auto-selecting the content of the next input on focus).
- **Security**: Discuss why you should mask inputs or use a specialized keypad on mobile.
- **Ref forwarding**: Use `refs` array or `querySelector` to manage the hopping of focus.

```javascript
const handleChange = (val, i) => {
  const newOtp = [...otp];
  newOtp[i] = val.slice(-1);
  setOtp(newOtp);
  if (val && i < otp.length - 1) inputRefs[i + 1].focus();
};
```
