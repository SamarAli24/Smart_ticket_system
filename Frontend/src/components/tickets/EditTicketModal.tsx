import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import Select from "../common/Select";
import Button from "../common/Button";
import type { AgentUser, Ticket } from "../../types";

export interface EditTicketInput {
  title: string;
  description: string;
  assigneeId: string;
}

interface EditTicketModalProps {
  open: boolean;
  ticket: Ticket | null;
  users: AgentUser[];
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (input: EditTicketInput) => void;
}

export default function EditTicketModal({
  open,
  ticket,
  users,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: EditTicketModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description);
      setAssigneeId(ticket.assignedTo?.id ?? "");
    }
  }, [ticket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, assigneeId });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit ticket"
      description="Update the ticket's details. Priority is re-evaluated automatically from the description."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        <Input
          label="Title"
          placeholder="Briefly summarize the issue"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextArea
          label="Description"
          placeholder="Describe the issue, steps to reproduce, and any error messages..."
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Select label="Assigned To" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
