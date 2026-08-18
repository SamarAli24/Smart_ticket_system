import { useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import type { Role } from "../../types";

export interface NewUserInput {
  fullName: string;
  email: string;
  role: Role;
  password: string;
}

interface AddUserModalProps {
  open: boolean;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (user: NewUserInput) => void;
}

export default function AddUserModal({
  open,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Agent");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ fullName, email, role, password });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add new user"
      description="Create a new support team member and assign their role."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        )}
        <Input
          label="Full name"
          placeholder="e.g. Jamie Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="name@smart.support"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          <option value="Agent">Agent</option>
          <option value="Admin">Admin</option>
        </Select>
        <Input
          label="Password"
          type="password"
          placeholder="Set a temporary password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
