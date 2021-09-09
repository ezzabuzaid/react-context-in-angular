import { Component, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { assertStringIsNotEmpty } from './utils';

@Component({
  selector: 'context',
  template: '<ng-content></ng-content>',
})
export class ContextComponent implements OnInit, OnChanges {
  @Input() defaultValue?: any;
  @Input() name!: string;

  constructor(
    @Optional() @SkipSelf() public parentContext: ContextComponent | null,
  ) { }


  ngOnInit(): void {
    assertStringIsNotEmpty('Context name', this.name);
    try {
      this.getContext(this.name);
      throw new Error(`Context ${ this.name } already exist.`);
    } catch (error) { }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const nameChange = changes.name;
    if (nameChange && !nameChange.isFirstChange()) {
      const { currentValue, previousValue } = nameChange;
      throw new Error(`Context name can be initialized only once.\n Original name ${ previousValue }\n New name ${ currentValue }`);
    }
  }

  public getContext(contextName: string) {
    let context: ContextComponent | null = this;
    while (context !== null) {
      if (context.name === contextName) {
        return context;
      }
      context = context.parentContext;
    }
    throw new Error(`No context with name ${ contextName } is found.`);
  }

}
