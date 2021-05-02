import { SMActionButton, SMDescription, SMPrimaryComponent, SMSecondaryComponent, SMTernaryComponent, SMTitle } from './SMComponents';

export class TemplatePageBuilder {
    private title;
    private description;
    private actionButton;
    private primaryComponent;
    private secondaryComponent;
    private ternaryComponent;

    addTitle(text: string): TemplatePageBuilder {
        this.title = SMTitle(text)
        return this
    }

    addDescription(text: string): TemplatePageBuilder {
        this.description = SMDescription(text)
        return this
    }

    addActionButton(text: string, onClick): TemplatePageBuilder {
        this.actionButton = SMActionButton(text, onClick)
        return this
    }

    addPrimaryComponent(model): TemplatePageBuilder {
        this.primaryComponent = SMPrimaryComponent(model)
        return this
    }

    addSecondaryComponent(setInput): TemplatePageBuilder {
        this.secondaryComponent = SMSecondaryComponent(setInput)
        return this
    }

    addTernaryComponent() : TemplatePageBuilder {
        this.ternaryComponent = SMTernaryComponent()
        return this
    }

    build() {
        return ({
            title:              this.title,
            description:        this.description,
            actionButton:       this.actionButton,
            primaryComponent:   this.primaryComponent,
            secondaryComponent: this.secondaryComponent,
            ternaryComponent:   this.ternaryComponent
        })
    }

    static get(): TemplatePageBuilder {
        return new TemplatePageBuilder()
    }
}