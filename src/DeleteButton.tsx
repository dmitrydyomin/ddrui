import React, { useCallback, useState } from 'react';
import { Button } from 'reactstrap';

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  if (open) {
    return (
      <>
        <Button className="me-2" size="sm" color="danger" onClick={onClick}>
          Delete
        </Button>
        <Button size="sm" color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </>
    );
  }

  return (
    <Button size="sm" color="danger" onClick={toggle}>
      Delete
    </Button>
  );
};
