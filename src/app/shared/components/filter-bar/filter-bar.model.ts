export class FilterField {
  name: string;
  type: string;
  value = '';

  getFilter(): string {
    if (!this.value) {
      return 'All';
    }

    return this.value;
  }

  constructor(name: string, value?: string) {
    this.name = name;
  }
}
