import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { createPasswordStrengthValidator } from './password-strength.validator';

@Directive({
  selector: '[appPasswordValidation]',
})
export class PasswordValidationDirective implements OnInit {
  @Input() username: string;
  @Input() parent;
  usernameFlag: boolean = false;
  upperFlag = false;
  lowerFlag = false;
  specialFlag = false;
  numberFlag = false;

  addWarning(warning: string, type: string) {
    const div = this.renderer.createElement('div');
    const text = this.renderer.createText(warning);
    this.renderer.setStyle(div, 'color', 'red');
    this.renderer.setAttribute(div, 'id', type);
    this.renderer.appendChild(div, text);
    this.renderer.insertBefore(
      this.parent.parentElement,
      div,
      this.renderer.nextSibling(parent)
    );
  }

  constructor(private eleRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit(): void {
    // this.addAll();
  }

  addAll() {
    this.addWarning('Must have an upper case letter', 'upper');
    this.addWarning('Must have a lower case letter', 'lower');
    this.addWarning('Must have a special character', 'special');
    this.addWarning('Must have a number', 'number');
    this.addWarning('Must not contain the username', 'userWarning');
  }

  @HostListener('keyup', ['$event.target.value']) keyup(event) {
    // if (event.length === 0) {
    //   this.addAll();
    // }
    const hasUpperCase = /[A-Z]+/.test(event);
    const hasLowerCase = /[a-z]+/.test(event);
    const hasNumber = /[0-9]+/.test(event);
    const hasSpecial = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+/.test(event);
    const hasUsername = event.includes(this.username);

    if (this.upperFlag) {
      this.renderer.removeChild(
        this.parent.parentElement,
        this.renderer.selectRootElement('#upper')
      );
      this.upperFlag = false;
    }
    if (!hasUpperCase) {
      this.addWarning('Password must contain an uppercase letter', 'upper');
      this.upperFlag = true;
    }

    if (this.lowerFlag) {
      this.renderer.removeChild(
        this.parent.parentElement,
        this.renderer.selectRootElement('#lower')
      );
      this.lowerFlag = false;
    }
    if (!hasLowerCase) {
      this.addWarning('Password must contain a lowercase letter', 'lower');
      this.lowerFlag = true;
    }

    if (this.numberFlag) {
      this.renderer.removeChild(
        this.parent.parentElement,
        this.renderer.selectRootElement('#number')
      );
      this.numberFlag = false;
    }
    if (!hasNumber) {
      this.addWarning('Password must contain a number', 'number');
      this.numberFlag = true;
    }

    if (this.specialFlag) {
      this.renderer.removeChild(
        this.parent.parentElement,
        this.renderer.selectRootElement('#special')
      );
      this.specialFlag = false;
    }
    if (!hasSpecial) {
      this.addWarning('Password must contain a special character', 'special');
      this.specialFlag = true;
    }

    if (this.usernameFlag) {
      this.renderer.removeChild(
        this.parent.parentElement,
        this.renderer.selectRootElement('#user')
      );
      this.usernameFlag = false;
    }
    if (hasUsername) {
      this.addWarning('Password must not contain the username', 'user');
      this.usernameFlag = true;
    }
  }
}
