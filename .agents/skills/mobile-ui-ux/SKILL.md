---
name: mobile-ui-ux
description: Implement or review the Baladi citizen mobile application with its React Native and Expo, Arabic RTL, accessibility, and hackathon presentation requirements. Use for mobile screens, components, flows, and UI reviews in this repository.
---

# Baladi citizen mobile UI and UX

Apply this skill whenever implementing or reviewing the Baladi citizen mobile application. Favor a polished, usable hackathon MVP over extra features or visual complexity.

## Product direction

- Build for phones with React Native and Expo conventions and native-feeling interaction. Avoid desktop and web UI patterns such as dense tables, hover-dependent controls, and multi-column dashboards.
- Make Arabic and right-to-left layout the primary experience. Check alignment, reading order, icon direction, navigation, and form fields in RTL. Keep numbers and other left-to-right content readable where needed.
- Use a clean, modern civic-service visual style. Keep a consistent spacing scale, typography hierarchy, color use, and component treatment across screens. Make the main action visually clear without adding decorative clutter.
- Keep navigation simple and predictable. Make report submission a short, obvious flow with only the information needed to submit; defer optional details when possible.

## Interaction and accessibility

- Use comfortably large touch targets and enough space between actions. Ensure labels, focus order, contrast, and screen-reader descriptions make controls and forms usable.
- Label required fields and validation errors clearly in Arabic. Preserve entered values when validation fails and place guidance near the relevant field.
- Handle the keyboard on forms: keep the active field and submit action reachable, avoid obscured inputs, and dismiss the keyboard naturally when moving through the flow.
- Design loading, empty, and error states for data-driven screens and submission. Give clear progress and recovery actions in plain Arabic; prevent accidental duplicate submissions.

## Review check

For each changed mobile screen or flow, inspect it at phone size in RTL and check the report path end to end. Review touch targets, spacing and typography consistency, keyboard behavior, form accessibility, and loading, empty, and error states. Fix visible rough edges that would weaken a presentation-quality MVP.
