import TemplatePage from "../../components/TemplatePage"
import { SMActionButton, SMDescription, SMTitle } from './SMComponents';

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

    addPrimaryComponent(primaryComponent): TemplatePageBuilder {
        this.primaryComponent = primaryComponent
        return this
    }

    addSecondaryComponent(secondaryComponent): TemplatePageBuilder {
        this.secondaryComponent = secondaryComponent
        return this
    }

    addTernaryComponent(ternaryComponent) : TemplatePageBuilder {
        this.ternaryComponent = ternaryComponent
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