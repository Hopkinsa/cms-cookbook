import { Component } from '@angular/core';
import { ScaffoldLayoutComponent } from './scaffold/scaffold.component';
@Component({
    templateUrl: './template.html',
    imports: [ScaffoldLayoutComponent],
    standalone: true,
})
export class Template { }