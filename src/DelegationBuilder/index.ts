export interface IBuild {
    eventTypes: Set<string>;
    delegatorSelectors: Set<string>;
    rootElements: Set<HTMLElement>;
}

export const emptyBuild = (): IBuild => ({
    eventTypes: new Set(),
    delegatorSelectors: new Set(),
    rootElements: new Set(),
});

export const mergeBuilds = (buildA: IBuild, buildB: IBuild): IBuild => ({

    eventTypes: new Set([
        ...buildA.eventTypes,
        ...buildB.eventTypes,
    ]),

    delegatorSelectors: new Set([
        ...buildA.delegatorSelectors,
        ...buildB.delegatorSelectors,
    ]),

    rootElements: new Set([
        ...buildA.rootElements,
        ...buildB.rootElements,
    ]),
});

interface IBuildStep {
    apply(source: IBuild): IBuild;
}

export class Roots implements IBuildStep {

    public apply(source: IBuild): IBuild {
        const append = emptyBuild();
        return mergeBuilds(source, append);
    }
}
