import { Transaction, CellLoop, Stream } from 'sodiumjs';
import { Label } from './Label';
import { Button } from './Button';

async function main() {
  Transaction.run(() => {
    const value = new CellLoop<number>();
    new Label(value.map(i => i.toString()));

    const btnPlus = new Button('+');
    const btnMinus = new Button('-');

    const sPlusDelta = btnPlus.sClicked.map(u => 1); // + 가 클릭되면 발사하는 스트림
    const sMinusDelta = btnMinus.sClicked.map(u => -1); // - 가 클릭되면 발사하는 스트림
    const sDelta = sPlusDelta.orElse(sMinusDelta); // 1 인지 -1 인지를 정해주는 스트림
    // const sDelta: Stream<number> = btnPlus.sClicked
    //   .map(u => 1)
    //   .orElse(btnMinus.sClicked.map(u => -1));

    const sUpdate: Stream<number> = sDelta
      .snapshot(value, (delta, _value) => delta + _value)
      .filter(n => n >= 0); // sDelta 로부터 update 값을 얻어내기 위한 스트림

    value.loop(sUpdate.hold(0));
  });
}

document.addEventListener('DOMContentLoaded', main);
