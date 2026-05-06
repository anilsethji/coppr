# Standard Operating Procedure: Bot Description Formatting

**Requirement:** All future EA bots and indicators uploaded to the Coppr Platform MUST use this specific Rich Text HTML formatting for their descriptions. The user should NOT need to request this format again.

## Template Structure
The description must be injected directly into the database as an HTML string using `dangerouslySetInnerHTML` standards. It must contain:
1.  **Introductory Paragraph:** Explaining the emotional/psychological benefit to the retail trader (e.g., peace of mind, reduced panic).
2.  **Transition:** Bold and italicized text leading to the features.
3.  **Features List:** A `<ul>` list with bullet points (`<li>`).
    *   Each point must highlight a key feature.
    *   The feature title must be wrapped in `<strong>` and color-coded appropriately using Tailwind hex codes (e.g., `#FF5252` for risk/loss, `#00E676` for profit, `#00B0FF` for equity).
    *   Key phrases within the explanation should also be bolded and color-coded.
4.  **Conclusion:** A final paragraph wrapping up the emotional benefit, using `#FFD700` (Gold) for emphasis on the ultimate outcome.

## Exact HTML Code Template
```html
<div class="space-y-4 text-[14px]">
  <p>
    [Emotional pain point]. The <strong class="text-white">[Bot Name]</strong> is built to give you <span class="text-[#FFD700] font-bold">[Primary Emotional Benefit]</span>. [Brief explanation of what it does].
  </p>
  
  <p class="text-white font-bold italic pt-2">Here is exactly how it protects your account:</p>
  
  <ul class="space-y-3 list-none pl-1">
    <li class="flex items-start gap-2">
      <span class="text-[#FF5252] mt-0.5">•</span>
      <span><strong class="text-white">[Feature 1]:</strong> [Description]. <span class="text-[#FF5252] font-bold">[Impact]</span>. [Conclusion].</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-[#00E676] mt-0.5">•</span>
      <span><strong class="text-white">[Feature 2]:</strong> [Description]. <span class="text-[#00E676] font-bold">[Impact]</span>. [Conclusion].</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="text-[#00B0FF] mt-0.5">•</span>
      <span><strong class="text-white">[Feature 3]:</strong> [Description]. <span class="text-[#00B0FF] font-bold">[Impact]</span>. [Conclusion].</span>
    </li>
  </ul>
  
  <p class="pt-2">
    [Wrap up text] <strong class="text-[#FFD700]">[Final Emotional Benefit]</strong>. [Call to action].
  </p>
</div>
```
