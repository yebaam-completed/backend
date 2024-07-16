/* eslint-disable @typescript-eslint/no-explicit-any */

export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLowerCase();
    return valueString
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static lowerCase(str: string): string {
    return str.toLowerCase();
  }

  static generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseJson(prop: string): any {
    try {
      JSON.parse(prop);
    } catch (error) {
      return prop;
    }
    return JSON.parse(prop);
  }

  static isDataURL(value: string): boolean {
    // Ajusta la expresión regular para permitir un `/` opcional después de 'data:'
    const dataUrlRegex = /^\s*data:\/?([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
    return dataUrlRegex.test(value);
  }
  static shuffle(list: string[]): string[] {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  static escapeRegex(text: string): string {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  static jsonParse(jsonString: string): any {
    try {
      const parsedValue = JSON.parse(jsonString);
      return { success: true, value: parsedValue };
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return { success: false, error };
    }
  }

  static jsonStringify(value: any): string {
    try {
      return JSON.stringify(value);
    } catch (error) {
      console.error('Error stringifying JSON:', error);
      // Retornar un valor predeterminado o manejar el error como prefieras
      return '';
    }
  }
}
