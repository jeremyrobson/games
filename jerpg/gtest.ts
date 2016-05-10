interface IOwner {
    feedPets() : void;
}

interface IEat {
    eat() : void;
}

class Animal implements IEat {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
    
    eat() {
        alert(this.type + " eats");
    }
}

class Dog extends Animal {
    constructor() {
        super("dog");
    }
}

class Cat extends Animal {
    constructor() {
        super("cat");
    }
}

class Owner<T extends IEat> implements IOwner {
	
    pets : Array<T>;
   
    constructor(pet: T) {
        this.pets = new Array<T>(); //is this allowed?
        this.pets.push(pet);
    }

    feedPets() {
        this.pets.forEach(
            (pet: T) => pet.eat()
        );
    
    }
}

var o = new Owner<Cat>(new Cat()); //works
o.feedPets();

var o = new Owner<Dog>(new Cat()); //should throw error
o.feedPets();

