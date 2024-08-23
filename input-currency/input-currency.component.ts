import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  forwardRef, Output, EventEmitter
} from '@angular/core';
import IMask from 'imask';
import {ControlValueAccessor, FormControl, FormControlName, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input-currency',
  template: `
    <input
      #appInputCurrency
      type="text"
      [id]="id"
      [class]="class"
      [value]="value"
      [placeholder]="placeholder"
      (input)="onInput($event.target.value)"
      (blur)="onBlur($event)"
      [disabled]="disabled"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCurrencyComponent),
      multi: true,
    },
  ],
})

export class InputCurrencyComponent implements ControlValueAccessor, OnInit {
  inputElement: any;
  maskOptions = {
    mask: '$ num',
    blocks: {
      num: {
        mask: Number,
        thousandsSeparator: ',',
        radix: '.',
        padFractionalZeros: true
      }
    }
  };
  value = '';

  @Input() class = '';
  @Input() disabled = false;
  @Input() id = '';
  @Input() placeholder = '';
  @Input() formControl: FormControl;
  @Input() formControlName: FormControlName;

  @Output() inputBlur = new EventEmitter<{ e: any }>();

  @ViewChild('appInputCurrency', {static: true}) internalInput: ElementRef<HTMLInputElement>;

  onChange = (value: string) => {
  }
  onTouched = (e: any) => {
  }


  ngOnInit(): void {
    this.inputElement = IMask(this.internalInput.nativeElement, this.maskOptions);
  }

  // This method is called by Angular to set the value from the model
  writeValue(val: string): void {
    if (val === null) {
      return;
    }

    this.value = this.maskNumber(val);
  }

  // This method is called by Angular when the value in the UI changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // This method is called by Angular when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Method to enable/disable the input
  setDisabledState?(isDisabled: boolean): void {
    // Handle the disabled state
  }

  // Handle input event
  onInput(val: string): void {
    const unmaskedValue = this.unmaskNumber(val);
    this.value = unmaskedValue;
    this.onChange(unmaskedValue);
  }

  onBlur(e: any): void {
    this.inputBlur.emit(e);
  }

  private maskNumber(num: any): string {
    return IMask.pipe(num.toString(),
      this.maskOptions,
      IMask.PIPE_TYPE.UNMASKED,
      IMask.PIPE_TYPE.MASKED
    );
  }

  private unmaskNumber(num: any): string {
    return IMask.pipe(num.toString(),
      this.maskOptions,
      IMask.PIPE_TYPE.MASKED,
      IMask.PIPE_TYPE.UNMASKED
    );
  }
}
