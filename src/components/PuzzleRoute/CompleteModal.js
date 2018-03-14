import React from 'react';
import { Button, Modal } from 'semantic-ui-react';

export default ({
  onClose,
  open,
}) => (
  <Modal size="mini" open={open} onClose={onClose}>
    <Modal.Header>
      Puzzle Complete!
    </Modal.Header>
    <Modal.Content>
      <p>Time: <em>i dont know im not keeping track yet haha</em></p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        content="Schweet!"
        icon="checkmark"
        labelPosition="right"
        onClick={onClose}
        positive
      />
    </Modal.Actions>
  </Modal>
)
