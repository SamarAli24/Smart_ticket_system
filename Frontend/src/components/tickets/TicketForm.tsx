import { useState } from "react";
import { Info, Send } from "lucide-react";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Select from "../common/Select";
import Button from "../common/Button";
import type { AgentUser } from "../../types";

interface TicketFormProps {
  users: AgentUser[];
  isSubmitting?: boolean;
  onSubmit: (data: { title: string; description: string; assigneeId: string }) => void;
}

export default function TicketForm({ users, isSubmitting, onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, assigneeId });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-8"
    >
      <Input
        label="Title"
        placeholder="Briefly summarize the issue"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="mt-5">
        <TextArea
          label="Description"
          placeholder="Describe the issue, steps to reproduce, and any error messages..."
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mt-5">
        <Select
          label="Assigned To"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
        >
          <option value="">Select an agent (or leave unassigned)</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Priority will be automatically determined based on ticket description. Status
          defaults to <span className="font-medium">Open</span> on creation.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </Button>
      </div>
    </form>
  );
}
