class Dog {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    console.log('qz', window['qz'])
    this._name = name;
    this._age = age;
  }

  get name(): string {
    return this._name;
  }

  get age(): number {
    return this._age;
  }

  bark() {
    console.log(`${this._name}:${this._age}:: Woof!`);
  }

  jump(func: (height: number) => void) {
    func(20);
  }
  
  sleep(options: { bed: boolean; hardness: string }) {
    if (options.bed) {
      console.log(`${this._name} is sleeping on a ${options.hardness} bed.`);
    } else {
      console.log(`${this._name} is sleeping on the floor. :(`);
    }
  }
}
