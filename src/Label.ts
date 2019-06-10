import { Cell, Operational, Transaction } from 'sodiumjs';

export class Label {
  private label: HTMLHeadingElement;

  constructor(text: Cell<string>) {
    Operational.updates(text).listen(t => {
      this.setText(t);
    });

    this.label = document.createElement('h1');
    this.render();

    Transaction.currentTransaction.post(0, () => {
      this.setText(text.sample());
    });
  }

  setText(text: string) {
    this.label.textContent = text;
  }

  render() {
    document.body.appendChild(this.label);
  }
}
