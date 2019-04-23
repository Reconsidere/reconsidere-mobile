export abstract class Mask {

    public static mask(type: string, value) {
        if (type === 'cpf') {
            return this.maskCPF(value);
        }
        if (type === 'cep') {
            return this.maskCEP(value);
        }
    }


    private static maskCPF(value) {
        if (value === undefined || value === null || value === '') {
            return;
        }
        try {
            value = this.removeFormat(value);
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3\-\$4');
        } catch (error) {
            return this.removeFormat(value);
        }

    }

    private static maskCEP(value) {
        if (value === undefined || value === null || value === '') {
            return;
        }
        try {
            value = this.removeFormat(value);
            return value.replace(/^([\d]{2})\.*([\d]{3})-*([\d]{3})/, '$1.$2-$3');
        } catch (error) {
            return this.removeFormat(value);
        }
    }

    private static removeFormat(value) {
        return value.replace(/(\.|\/|\-)/g, '');
    }
}