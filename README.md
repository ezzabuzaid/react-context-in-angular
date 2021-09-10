Original Article [Here](https://dev.to/ezzabuzaid/react-context-in-angular-i4a)


## Introduction

_The drawing was made via  [Excalidraw](https://excalidraw.com/)_.

In this article, I'm going to show you how to mimic **React Context API** in **Angular**, I'll start by defining **React Context**, talk about what problem is meant to solve, and a possible implementation in Angular.

I will focus more on implementation and detail it as possible rather than explaining definitions, nonetheless, I'll make sure to explain any irrelevant terms.

If at any point you don't feel interested in reading further, think of this article as a new approach for component communication in Angular.

For clarity about what I’m going to talk about, the [project](https://github.com/ezzabuzaid/react-context-in-angular/tree/main/src/app/context) is available to browse through Github. or a [Demo](https://stackblitz.com/edit/github-ksgaad-aujpdi) if you prefer.

## What Is React Context API

From React [Documentation](https://reactjs.org/docs/context.html)
> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

**props** in Angular terms corresponds to **Inputs**

In other words, context can help you to pass down inputs/props through a components tree without the need to define them at every level/component.

Words 📝 might not be that efficient, a practical example might be.

## The Problem

Here's 4 components (AppComponent, Parent, Child, Grandchild), the **AppComponent** passes a value to the **Parent** component, the **Parent** component will pass it to the **Child** component which forwards it to the Grandchild component.

```typescript
@Component({
  selector: 'app-root',
  template: '<app-parent [familyName]="familyNameValue"></app-parent>'
})
export class AppComponent {
  familyNameValue = 'The Angulars';
}
```

```typescript
@Component({
  selector: 'app-parent',
  template: '<app-child [familyName]="familyName"></app-child>'
})
export class ParentComponent {
  @Input() familyName: string;
}
```

```typescript
@Component({
  selector: 'app-child',
  template: '<app-grandchild [familyName]="familyName"></app-grandchild>'
})
export class ChildComponent {
  @Input() familyName: string;
}
```

```typescript
@Component({
  selector: 'app-grandchild',
  template: 'Family Name: {{familyName}}'
})
export class GrandchildComponent {
  @Input() familyName: string;
}
```

As you see, we had to declare the same input at every component starting from the **Parent** down the Grandchild, in **React** terms this is called [Prop Drilling](https://kentcdodds.com/blog/prop-drilling).

Going to the definition again
> Context provides a way to pass data through the component tree without having to pass ~~props~~ **Inputs** down manually at every level.

Good, let's see the **Context** way.


## The Solution

_Hint: I'll explain the implementation later on._ keep reading for now.

What if you can remove the inputs and only have a generic one that could be accessed from anywhere in the tree, like this

```typescript
@Component({
  selector: 'app-root',
  template: `
    <context name="FamilyContext">
      <provider name="FamilyContext" [value]="familyNameValue"> // This part
        <app-grandchild> </app-grandchild>
      </provider>
    </context>
`
})
export class AppComponent { }
```

And for the component that needs the value
```typescript
@Component({
  selector: 'app-grandchild',
  template: `
    <consumer name="FamilyContext">
        <ng-template let-value>
           Family Name: {{value}}
        </ng-template>
    </consumer>
`
})
export class GrandchildComponent { }
```
 
![ContextVsNoContext](https://user-images.githubusercontent.com/29958503/131257729-d1137627-6900-4681-aa7a-faaa2c3c840f.png)

While this approach seems to work, I do not think a lot of people will agree on this, I myself thought about [sandboxing](https://angular.io/guide/dependency-injection-in-action#multiple-service-instances-sandboxing) first, maybe that's why there's no like to **React Context API** in **Angular**. but again see it as a different way to achieve the same result. 

By now it's clear what problem does **Context API** solves. It's time to see how it works.

## How Does React Context API Work

_Warning:  I'll use **React** components 😏_.

Context API comes with two important components, **Provider** and **Consumer**. **Provider** is the component that will pass a value for decedents consuming components. One provider can have multiple consumers and other providers.

**Consumer**, as you may have thought, will consume **Provider** value. React will go up the component tree starting from the **Consumer** component to find the nearest **Provider** and provide its value to that **Consumer** as callback style, if none is found a default value will be used instead. The **Consumer** will re-render whenever a Provider ancestor value changes.

To create context you simply call `createContext` passing default value if needed, a context object with **Provider** and **Consumer** components attached to it will return.

```jsx
const MyContext = React.createContext('defaultValue');
```

The provider have `value` props that will passed down to the consumers.
```jsx
function App() {
  return (
    <MyContext.Provider value="valueToBeConsumedByDescendantsConsumer">
      <ComponentThatHaveConsumerAsChild />
    </MyContext.Provider>
  );
}
```
The consumer takes a function with the Provider value as an argument, the function will be called (re-render 🙃) whenever the Provider value changes.

```jsx
function ComponentThatHaveConsumerAsChild() {
  return (
    <MyContext.Consumer>
      {(value) => (<h1>{value}</h1>)}
    </MyContext.Consumer>
  );
}
```

You might want to know that this is not the only way to consume context, there's `contextType` and `useContext`, I won't cover them because those are applicable only to React way of doing things.

if you didn't get the whole picture, check the [official docs](https://reactjs.org/docs/context.html), perhaps it would be more helpful.

Enough talking about **React**. It's time to code.

## Angular implementation

In Angular things are different, so we'll do things in different styles but the same concept and goals remain.

If you start this article from the beginning you saw that we introduced three components

1. `context`
2. `provider`
3. `consumer`

and ended up using them like this

```typescript
@Component({
  selector: 'app-root',
  template: `
    <context name="FamilyContext"> // (1) -----> The Context Component
      <provider name="FamilyContext" [value]="familyNameValue"> // (2) -----> The Provider Component
        <app-parent> </app-parent>
      </provider>
    </context>
`
})
export class AppComponent { }

@Component({
  selector: 'app-grandchild',
  template: `
    <consumer name="FamilyContext"> // (3) -----> The Consumer Component
        <ng-template let-value>
           Family Name: {{value}}
        </ng-template>
    </consumer>
  `
})
export class GrandchildComponent { }
```

I'll explain each component in detail soon. 

### Utility function for strict mode people 😅
 
```typescript
export function assertNotNullOrUndefined<T>(value: T, debugLabel: string): asserts value is NonNullable<T> {
    if (value === null || value === undefined) {
        throw new Error(`${ debugLabel } is undefined or null.`);
    }
}

export function assertStringIsNotEmpty(value: any, debugLabel: string): asserts value is string {
    if (typeof value !== 'string') {
        throw new Error(`${ debugLabel } is not string`);
    }
    if (value.trim() === '') {
        throw new Error(`${ debugLabel } cannot be empty`);
    }
}
```

### The Context Component

This component is responsible for declaring a scope for providers and consumers, providers can only be under their context, the same rule applies to consumers.

Unlike **React Context API**, we don't have reference to a context so in order to ensure the relationship between providers and consumers to a context we need to give the context and its components a **name**.

A **name** makes it possible to
1. Have multiple contexts that can be used without interfering with each other. 
2. The provider and consumer to find their Context easily by looking the name up.
3. Ensures a provider and a consumer are defined under their context and not in any other place.
4. Prevents duplicated contexts. 

Another thing related to the context component is the `defaultValue`, if you recall from above _if a context doesn't have any **provider** a default value will be used instead._

![ContextDefaultValue](https://user-images.githubusercontent.com/29958503/131170879-caf529f1-5be2-4518-bc9a-c8a4ef3a6f79.png)

In the previous Image, **Consumer ( A )** will have the value of the **Context** because there's no provider above it, and **Consumer ( B )** will have the value of **Provider ( 1 )**.

_Initial Implementation_

```typescript
@Component({
  selector: 'context',
  template: '<ng-content></ng-content>' // ----> (1)
})
export class ContextComponent implements OnInit, OnChanges {
  @Input() name!: string; // ----> (2)
  @Input() defaultValue?: any; // ----> (3)

  constructor() { }

  ngOnInit(): void {
    assertStringIsNotEmpty(this.name, 'Context name');  // ----> (4)
  }

  ngOnChanges(changes: SimpleChanges): void {
    const nameChange = changes.name;
    if (nameChange && !nameChange.isFirstChange()) {
      const { currentValue, previousValue } = nameChange;
      throw new Error(`Context name can be initialized only once.\n Original name ${ previousValue }\n New name ${ currentValue }`);
    }
  }

}
```

1. [ng-content](https://angular.io/guide/content-projection) to project the content as is.
2. Name of the context. _reasons above 😁_
3. `value` that will be provided to the consuming components in case there's no provider for this context.
4. Ensures the context name is a string and not empty. The same check will be used in the other components.
5. The **name** cannot be changed since the code should adhere to the **React** approach, nevertheless, this is totally up to you. the same check will be used in the other components.

### The Provider Component

This component will pass down its value to the consumers hence we need to have an input for that value. Also, you can have zero or more provider components for the same context. consumers will get the value from the nearest one.

![ProvidersChain](https://user-images.githubusercontent.com/29958503/131171896-70e7fdfa-4579-4dd3-852b-114ea67e0bc1.png)

In the previous Image, **Consumer ( A )** will have the value of the **Context**, but **Consumer ( B )**, **Consumer ( C )**, and **Consumer ( E )** will have the value of **Provider ( 1 )**. 
 **Consumer ( D )** will have the value of **Provider ( 2 )** because it is the nearest one.

_Initial Implementation_

```typescript
@Component({
  selector: 'provider',
  template: '<ng-content></ng-content>'
})
export class ProviderComponent implements OnInit {
  @Input() name!: string;   // ----> (1)
  @Input() value?: any;   // ----> (2)

  ngOnInit(): void {
    assertStringIsNotEmpty(this.name, 'Provider context name');

    if (this.value === undefined) {   // ----> (3)
      throw new Error(`Provider without value is worthless.`);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const nameChange = changes.name;
    if (nameChange && !nameChange.isFirstChange()) {
      const { currentValue, previousValue } = nameChange;
      throw new Error(`Context name can be initialized only once.\n Original name ${ previousValue }\n New name ${ currentValue }`);
    }
  }

}
```

1. Name of the context. The name is needed in order to know to which context it belongs.
2. `value` that will be provided to the consuming components.
3. The provider is valuable as long it holds a value, if at first it doesn't so there's no point in having it, let the consumers rely on a different provider or the default value provided when establishing the context

### The Consumer Component

The component will eventually have the value of the nearest provider or the default context value in case no provider is found up in the tree.

before digging into it, let's see the example usage first.

```typescript
@Component({
  selector: 'app-grandchild',
  template: `
    <consumer name="FamilyContext">
        <ng-template let-value>
           Family Name: {{value}}
        </ng-template>
    </consumer>
`
})
export class GrandchildComponent { }
```

`ng-template` will be used as a convenient way to be able to provide the nearest provider `value` or the context `defaultValue` using template variable `let-value` and to have more control over the change detection process. _More about this later on_. 

_Initial Implementation_

```typescript
@Component({
  selector: 'consumer',
  template: '<ng-content></ng-content>',
})
export class ConsumerComponent implements OnInit {
  @Input() name!: string;   // ----> (1)
  @ContentChild(TemplateRef, { static: true }) templateRef!: TemplateRef<any>;   // ----> (2)
  
  ngOnInit(): void {
    assertStringIsNotEmpty(this.name, 'Consumer context name');

    if (this.templateRef === undefined) {   // ----> (3)
      throw new Error(`
        Cannot find <ng-template>, you may forget to put the content in <ng-template>.
        If you do not want to put the content in context then no point in using it.
      `);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const nameChange = changes.name;
    if (nameChange && !nameChange.isFirstChange()) {
      const { currentValue, previousValue } = nameChange;
      throw new Error(`Context name can be initialized only once.\n Original name ${ previousValue }\n New name ${ currentValue }`);
    }
  }

}
```

1. Name of the context. The name is needed in order to know to which context it belongs.
2. The template reference, [`static: true`](https://angular.io/guide/static-query-migration#is-there-a-case-where-i-should-use-static-true) used to be able to get it in `ngOnInit`.
4. `ng-template` is mandatory. why would you need to use the consumer if you're not making use of it is value?

**RECAP**: all the code right now only validates the inputs.

The next step is to make sure providers and consumers components are using the correct context.

---

Hopefully, You know **Dependency Injection** and how the resolution process works. in nutshell, You inject a dependency and **Angular** will search for the implementation in [several injectors](https://angular.io/guide/hierarchical-dependency-injection) if none is found an error will be all over the browser console 😁.

It is important to understand the resolution process in order to understand the rest of the code. the validation and value resolving logic relying on that mechanism. basically, we'll link each component type with the immediate next one above it, it is like creating a chain of components each has its parent and the final one (first on the tree) will have **null**. just like the [Prototype Chain](https://dev.to/lydiahallie/javascript-visualized-prototypal-inheritance-47co) 😁. take a look at the next image, perhaps it will clear the idea. 

![ResolutionProccess](https://user-images.githubusercontent.com/29958503/131176220-b9688af6-0587-4a73-bc9d-8f08ad54e493.png)

### Context Validation

1. Context should be unique, you cannot have multiple contexts with the same name. 
2. Providers and Consumers must have a context.

**First**, adding a method to `ContextComponent` that will ensure no other context with the same name is exist.

```typescript
@Component({
  selector: 'context',
  template: '<ng-content></ng-content>',
})
export class ContextComponent implements OnInit {
  @Input() defaultValue?: any;
  @Input() name!: string;

  constructor(
    @Optional() @SkipSelf() public parentContext: ContextComponent | null   // ----> (1)
  ) { }

  ngOnInit(): void {    
    assertStringIsNotEmpty(this.name, 'Context name'); 
    this.ensureContextUniqueness(this.name); // ----> (2)
  }

  ... code omitted for brevity

  public getContext(contextName: string) {  // ----> (3)
    let context: ContextComponent | null = this;
    while (context !== null) {
      if (context.name === contextName) {
        return context;
      }
      context = context.parentContext;
    }
  return undefined;
  }

  public ensureContextUniqueness(contextName: string) {   // ----> (4)
    let context: ContextComponent | null = this.parentContext;
    while (context !== null) {
      if (context.name === contextName) {
        throw new Error(`Context ${ this.name } already exist.`);
      }
      context = context.parentContext;
    }
  }

}
```

1. Inject the parent context component 😲 _Check the previous image_.

 `@Optional()` is used to implies that this context may be the first context in the tree, therefore no parents will be found.
 `@SkipSelf()` is used to tell the dependency resolution to [skip the current component injector and start the process from the parent injector](https://angular.io/api/core/SkipSelf) because we already have the current context.

2. Checks if a context with the same name already exists and if so throws an error.
3. Find a context by a name, starting from the current context, check if its name is equal to the parameter, if not equal repeat the same step with the parent. In the end, if no context is found return undefined. This method will be needed later on with the other components.
4. Like point 3, but start with the parent context and not the context itself. 

**Second**, modify the `ProviderComponent` to grab its context and ensure that it exists.

```typescript
@Component({
  selector: 'provider',
  template: '<ng-content></ng-content>'
})
export class ProviderComponent implements OnInit {
  @Input() name!: string;
  @Input() value?: any;
  private providerContext!: ContextComponent;

  constructor(
    @Optional() private context: ContextComponent | null,    // ----> (1)
  ) { }

  ngOnInit(): void {
    ... code omitted for brevity

    if (this.context === null) {    // ----> (2)
      throw new Error(
        'Non of provider ancestors is a context component,
         ensure you are using the provider as a context descendant.'
      );
    }

    this.providerContext = this.context.getContext(this.name);  // ----> (3)
    assertNotNullOrUndefined(this.providerContext, `Provider context ${this.name}`);  // ----> (4)
  }

  public getProvider(contextName: string) {  // ----> (5)
    let provider: ProviderComponent | null = this;
    while (provider !== null) {
      if (provider.name === contextName) {
        return provider;
      }
      provider = provider.parentProvider;
    }
    return undefined;
  }

}
```

1. Inject the `ContextComponent`. Angular will search for the nearest context component and inject it, this component will be used to search for another context up in the tree. 
2. Check if there's context at all before searching for the provider context. this might be helpful so you immediately know you missed adding the context.
3. Get the provider context and assign it to its instance.
4. Ensure the provider has context.
4. Find a provider by a context name, starting from the current provider, check if its name is equal to the parameter, if not equal repeat the same step with the parent. In the end, if no provider is found it is okay to return undefined to state that a context doesn't have a provider since it's optional. This method will be needed soon in the consumer component.

**Third**, modify the `ConsumerComponent` to grab its context and provider and ensure its context is exists.

```typescript
@Component({
  selector: 'consumer',
  template: '<ng-content></ng-content>',
})
export class ConsumerComponent implements OnInit {
  @Input() name!: string; 
  @ContentChild(TemplateRef, { static: true }) templateRef!: TemplateRef<any>;
  private consumerContext!: ContextComponent;
  private consumerProvider?: ProviderComponent;

  constructor(
    @Optional() private context: ContextComponent  // ----> (1)
  ) { }

  ngOnInit(): void {
    ... code omitted for brevity

    if (this.context === null) {   // ----> (2)
      throw new Error(
        'Non of consumer ancestors is a context component,
         ensure you are using the consumer as a context descendant.'
      );
    }
    this.consumerContext = this.context.getContext(this.name);  // ----> (3)
    this.consumerProvider = this.provider?.getProvider?.(this.name);  // ----> (4)
    assertNotNullOrUndefined(this.consumerContext, `Consumer context ${this.name}`);  // ----> (5)
  }
}
```

1. Inject the `ContextComponent`. Angular will search for the nearest context and inject it.
2. Check if there's context at all before searching for the consumer context. this might be helpful so you immediately know you missed adding the context.
3. Get the consumer context and assign it to its instance.
4. Ensure the consumer has a context.
5. Get the consumer nearest provider and assign it to the consumer instance. This will be used next to observe provider value changes.

**RECAP**: The code validates the inputs and ensures a context exists and only one exists and is correctly used, also it guides the developer on how to use the context and its components.

Now, it's time for getting the value from the context and the nearest provider to the consumer. 

### Providing the `value`

If you start this article from the beginning you've read that
>  The **Consumer** will re-render whenever a Provider ancestor value changes.

That means the `ng-template` should be updated as well and not just building it the first time.

Providing the value might seem easy at first glance since you just need to build the `ng-template` and bind a value to it, while that is correct, there're other concerns when it comes to **Angular Change Detection**, for instance updating the template value in a component that is using `OnPush` change detection strategy is difficult than the normal component that uses the `Default` change detection strategy, more information about this soon in sepearted section.

For building, there's [ViewContainerRef](https://angular.io/api/core/ViewContainerRef) the create and host the `ng-template`, also it returns a reference to the `ng-template` so we can use it to update its value. _[more examples and information](https://angular.io/guide/dynamic-component-loader)._


```typescript
@Component({
  selector: 'consumer',
  template: '<ng-content></ng-content>',
})
export class ConsumerComponent implements OnInit, OnDestroy {
  ... code omitted for brevity

  private buildTemplate(initialValue: any) {   // ----> (1)
    this.embeddedView = this.viewContainerRef.createEmbeddedView(this.templateRef, {
      $implicit: initialValue
    });
  }

  private updateTemplate(newValue: string) {   // ----> (2)
    this.embeddedView!.context = {
      $implicit: newValue
    };
    this.embeddedView?.markForCheck();
  }

  private render(value: any) {   // ----> (3)
    if (this.embeddedView) {
      this.updateTemplate(value);
    } else {
      this.buildTemplate(value);
    }
  }

}

```
1. Create the template passing it the initial value (_which could be its context default value or its nearest provider current value_) and stores the `ng-template` reference for later use.
2. Update the template value, the `let-value`, and mark it to be checked in the [next change detection cycle](https://angular.io/api/core/ChangeDetectorRef#markforcheck).
3. Wrapper method to either update the template in case it is already there or build it otherwise.  

For value changes, normally, the lifecycle that is used to observe `@Input` changes is `OnChanges`, but since the value is not passed directly to the consumer component it cannot be used there.

The `ProviderComponent` will have the `ReplaySubject` that will emit the new provider value and the `ConsumerComponent` will subscribe to that subject to update its template.

```typescript

@Component({
  selector: 'provider',
  template: '<ng-content></ng-content>'
})
export class ProviderComponent implements OnInit, OnDestroy {
  private valueState = new ReplaySubject<any>(1);   // ----> (1)

  ngOnChanges(changes: SimpleChanges): void {   // ----> (2)
    const valueChange = changes.value;
    if (valueChange) {
      this.brodcaseValueChanges(valueChange.currentValue);
    }
  }

  ... code omitted for brevity

  private brodcaseValueChanges(newValue: any) {
    this.valueState.next(newValue);
  }

  public valueChanges() {   // ----> (3)
    return this.valueState.asObservable();
  }

  ngOnDestroy(): void {
    this.valueState.complete();   // ----> (4)
  }

}

```

1. Initialize the `ReplaySubject` with a buffer up to 1 so the new consumers will always be able to access the provider's last value.
2. Modify the `ngOnChanges` lifecycle that was used before to ensure the context name doesn't change to have the logic of detecting the provider value changes.
3. Convert the `ReplaySubject` to observable for the consumers' components.
4. On `ProviderComponent` destroy, complete the `ReplaySubject` to free up the memory.

Now with the `ConsumerComponent` part

```typescript

@Component({
  selector: 'consumer',
  template: '<ng-content></ng-content>',
})
export class ConsumerComponent implements OnInit, OnDestroy {

  private providerValueChangesSubscription?: Subscription;  // ----> (1)

  ngOnInit(): void {
    if (this.consumerProvider) {  // ----> (2)
      this.providerValueChangesSubscription = this.consumerProvider
        .valueChanges()
        .subscribe((providerValue) => {
          this.render(providerValue);  // ----> (3)
        });
    } else {  // ----> (4)
      this.render(this.consumerContext.defaultValue);
    }
  }

  ... code omitted for brevity

  ngOnDestroy(): void {
    this.providerValueChangesSubscription?.unsubscribe();  // ----> (5)
  }

}

```

1. A field to hold the provider subscription to unsubscribe on the component destroy.
2. Check if a provider is defined to subscribe to its value changes.
3. If there's a provider re-render on its value changes
4. If there's no provider render only once with the context default value.
5. Unsubscribe from the provider `ReplaySubject` on component destroy.

---

Well, you made it so far, good for you! 😄✌️, now you have **React Context in Angular**, how great was that?
Let's see the **Angular** way of sharing data in the component tree.

## The Angular Way

**Angular** does have [Dependency Injection](https://angular.io/guide/dependency-injection) framework that provides different approaches to handle a situation where something like **React Context API** is needed.

In the "The Problem" section, you saw that to pass down a value to the descendants' components you have to declare an `@Input` at every component even though that a component might merely act as a wrapper for another component. This actually can be changed by providing an `InjectionToken` to the ancestor component and inject that token at any descendant component to utilize the value.

Change the root component to include the InjectionToken

```typescript
const FamilyNameToken = new InjectionToken('FamilyName');
@Component({
  selector: 'app-root',
  template: `<app-grandchild> </app-grandchild>`,
  providers: [{provide: FamilyNameToken, useValue: 'The Angulars'}]
})
export class AppComponent { }
```

And for the component that needs the value to inject the InjectionToken

```typescript
@Component({
  selector: 'app-grandchild',
  template: `Family Name: {{familyNameValue}}`
})
export class GrandchildComponent {
  constructor(@Inject(FamilyNameToken) public familyNameValue: string) { }
 }
```

That might look easy and simple at first, but the catch is when you want to update the value you need to have a kind of **RxJS** `Subject` because **Angular** will hard inject the value that corresponds to the `InjectionToken` into the `GrandchildComponent`. The other way is to use a class provider to act as a state holder.

```typescript
class FamilyName {
  private state = new ReplaySubject(1);
  public setName(value: string) {
    this.state.next(value);
   }
  public getName() {
    return this.state.asObservable();
  }
}
```

The root component will inject the class and sets the value.
 
```typescript
@Component({
  selector: 'app-root',
  template: `<app-grandchild> </app-grandchild>`,
  providers: [FamilyName]
})
export class AppComponent {
  constructor(public familyName: FamilyName) {
    $familyNameState = this.familyName.setName('The Angulars');
  }
}
```

And for the component that needs the value to inject the `FamilyName` class and subscribe to the changes.

```typescript
@Component({
  selector: 'app-grandchild',
  template: `Family Name: {{$familyNameState|async}}`
})
export class GrandchildComponent {
  $familyNameState = this.familyName.getName();
  constructor(public familyName: FamilyName) { }
 }
```

Also, you can re-provide the `FamilyName` class at any component level so it can act as the `ProviderComponent`.

With that said, having a way to pass down a value within the component template it self can reduce the amount of class you will need.

## Example

To put the implementation in action, I'll use chat components to illustrate the usage of the context.

_Follow the [demo](https://stackblitz.com/edit/github-ksgaad-aujpdi)_ to see the result.

_Chat Message Component_ 
Uses consumer to obtain the message

```typescript
@Component({
    selector: 'app-chat-message',
    template: `
    <consumer name="ChatContext">
        <ng-template let-value>
            <h4>{{value.message}}</h4>
        </ng-template>
    </consumer>
    `
})
export class ChatMessageComponent { }
```

_Chat Avatar Component_ 
Uses consumer to obtain the avatar. notice the `changeDetection` is changed to `OnPush`.

```typescript
@Component({
    selector: 'app-chat-avatar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <consumer name="ChatContext">
        <ng-template let-value>
            <img width="50" [src]="value.avatar">
        </ng-template>
    </consumer>
    `
})
export class ColorAvatarComponent { }
```

_Chat Container Component_ 
Group the other components and perhaps for styling and aligning. it uses the provider declared in `AppComponent` for the first chat message and a new provider for the second chat message

```typescript
@Component({
    selector: 'app-chat-container',
    template: `
    <div style="display: flex;">
        <app-chat-avatar></app-chat-avatar>
        <app-chat-message></app-chat-message> 
        <provider name="ChatContext" [value]="{name:'Nested Provider Value'}">
            <app-chat-message></app-chat-message>
        </provider>
    </div>
    `
})
export class ChatContainerComponent { }
```

_App Component_ 
Declare a context with the name _ChatContext_  with no default value and a provider with initial value `chatItem` which will be shared to `ChatMessageComponent` and `ChatAvatarComponent`.

Clicking on the _Change Chat Item_ button will update the `chatItem` reference hence updating the consumers to get the new value.

```typescript
@Component({
  selector: 'app-root',
  template: `
  <context name="ChatContext">
    <provider [value]="chatItem" name="ChatContext">
      <app-chat-container></app-chat-container>
    </provider>
  </context>
  <button (click)="updateChatItem()">Change Chat Item</button>
  `
})
export class AppComponent {
  chatItem = {
    message: 'Initial name',
    avatar: 'https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg',
  }

  updateChatItem() {
    const randomInt = Math.round(Math.random() * 10);
    this.chatItem = {
      message: `Random ${ randomInt }`,
      avatar: `https://icon-library.com/images/avatar-icon-images/avatar-icon-images-${ randomInt }.jpg`,
    }
  }

}
```


## Bonus Part: The Issue With OnPush

In the **Angular Implementation** section, there's was an issue when a consumer **host** component _(the component that will be the consumer parent)_ is using the `OnPush` change detection strategy so as fix a `ReplaySubject` used to share the value to the consumer component from its nearest provider.

The thing is that `OnPush` prevents the component from being auto-checked thus the template of the component won't be updated except on special cases.

* One of the components `@Input` reference changed.
* An event handler of the component was triggered.
* An observable linked to the component template via the async pipe emits.

Unfortunately, neither of the cases above is applicable on The `ConsumerComponent` 
1. It doesn't have an `@Input` for the value because it will be bonded indirectly.
2. It doesn't have any event handler.
3. And no observable can be linked to its template since we project the content as is.

_Hint: component template implies the `template` property in the `@Component` decorator and doesn't refer to `ng-template`._

The other solution and the initial implementation was to use The [DoCheck](https://angular.io/api/core/DoCheck) lifecycle because it is usually used when a component is using `OnPush` change detection strategy to detect changes to mutable data structures and mark the component for the next change detection check cycle accordingly.

Moreover, the `DoCheck` lifecycle will be invoked [during every change detection run](https://indepth.dev/posts/1131/if-you-think-ngdocheck-means-your-component-is-being-checked-read-this-article#when-is-ngdocheck-triggered) but with `OnPush` the change detector will ignore the component so it won't be invoked unless it happens manually and again even this is out of the scope because you do not know if the consumer provider value changed or not.

That was just a plus section for the folks who will wonder about that.

## Summary

If you didn't use state management libraries before, you might find this handy since it somehow solves the same issue, and if you coming from `React` background this can be an advantage to have in **Angular**, nevertheless, Angular can do it on its own with a bit knowledge of dependency injection.

Having such functionality in your app can impart additional value, on the other hand, you have to adapt to the new way of sharing data.
