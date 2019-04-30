import { Location } from 'src/models/location';
import { Payment } from './payment';
import { Scheduling } from './scheduling';

export class Customer {
    _id: string;
    name: string;
    email: string;
    cpf: string;
    password: string;
    birthday: Date;
    creationDate: Date;
    sex: string;
    token?: string;
    location: Location;
    materials: [];
    payment: Payment;
    scheduling: any[];
}


export namespace Customer {
    export enum Material {
        Paper = 'Papel',
        Plastic = 'Plástico',
        Glass = 'Vidro',
        Metal = 'Metal',
        Isopor = 'Isopor',
        Tetrapack = 'Tetrapack'
    }
}

export namespace Customer {
    export enum Gender {
        Masc = 'Masculino',
        Fem = 'Feminino'
    }
}