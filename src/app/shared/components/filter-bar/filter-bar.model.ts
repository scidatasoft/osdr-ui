export class FilterField {
  name: string;
  type: string;
  value = '';

  constructor(name: string, value?: string) {
    this.name = name;
  }

  getFilter(): string {
    if (!this.value) {
      return 'All';
    }

    return this.value;
  }
}
