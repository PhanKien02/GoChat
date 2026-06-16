# Build a Production-Ready Chat Application UI

Create a **production-ready chat application UI** using **React + TypeScript + TailwindCSS**.

## Goal

Build a modern chat interface that feels like a combination of:

- ChatGPT
- Discord
- Telegram
- Linear

Prioritize:

- usability
- clean layout
- developer-friendly structure
- responsive design
- reusable components

Avoid overly flashy visuals.

---

## Layout

### Left Sidebar

Include:

- app logo
- search conversations input
- "New Chat" button
- recent conversations list
- unread message badge
- active conversation highlight
- online/offline status indicator

---

### Main Chat Area

Include:

- top header
  - avatar
  - username
  - status
  - optional actions menu

- message list

Messages should support:

- incoming messages aligned left
- outgoing messages aligned right
- avatar
- timestamp
- read receipts
- grouped messages from same sender
- markdown rendering
- code blocks with copy button

Also include:

- unread separator
- typing indicator
- loading state
- empty state when no chat is selected

---

### Message Composer

Bottom sticky input bar with:

- autosize textarea
- emoji picker trigger
- attachment upload button
- image/file preview before sending
- send button
- disabled/loading send state

---

## Design System

Style should feel:

- premium
- minimal
- modern SaaS

Use:

- dark mode
- rounded-2xl corners
- subtle shadows
- soft borders
- generous spacing
- smooth hover transitions
- clean typography

Avoid:

- excessive gradients
- overly decorative UI
- clutter

---

## Technical Requirements

Use:

- React
- TypeScript
- TailwindCSS

Requirements:

- component-based architecture
- reusable components
- clean file structure
- easy integration with REST API
- easy integration with WebSocket / Socket.IO backend

Suggested reusable components:

- `Sidebar`
- `ConversationList`
- `ConversationItem`
- `ChatHeader`
- `MessageBubble`
- `MessageList`
- `TypingIndicator`
- `MessageComposer`
- `EmptyState`

---

## Responsiveness

Desktop-first layout.

Also support:

- tablet
- mobile

Mobile behavior:

- collapsible sidebar
- slide-over conversation list
- full-screen chat view

---

## UX Details

Add polished interaction states:

- hover
- focus
- active
- loading
- disabled

Add smooth transitions for:

- opening conversations
- sending messages
- sidebar collapse
- typing indicator

---

## Final Direction

Make it feel like:

**Linear + ChatGPT + Discord combined**

Focus on:

- clean UX
- readability
- speed
- maintainability

---
## design model data

```typescript
interface User {
  id: string;
  username: string;
  email?: string;
  password?: string;
  avatar?: string;
  online: boolean;
}

interface Conversation {
  id: string;
  type: "private" | "group";
  participants: User[];
  lastMessage: Message;
  unreadCount?: number;
  updatedAt: number; // timestamp
}

interface Message {
  id: string;
  conversationId: string;
  sender: User;
  attachment?: Attachment[];
  content: string; // markdown
  createdAt: number; // timestamp
  readBy?: string[];
  status?: "sent" | "delivered" | "read";
}

interface Attachment {
  id: string;
  messageId: string;
  type: "image" | "file" | "video" | "document" | "audio" | "other";
  url: string;
  filename?: string;
  size?: number;
}

interface IResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

---
Keep it practical enough to be used directly in a real production app.
Make it feel premium like Linear, Vercel, Discord and ChatGPT combined.
Avoid overly flashy gradients. Keep it minimal, practical and developer-friendly.