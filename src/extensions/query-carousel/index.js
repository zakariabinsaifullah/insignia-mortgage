/**
 * Query Carousel — Block Variation for core/query
 *
 * Adds a "Query Carousel" variation that converts the Query Loop into a
 * Swiper-powered carousel on the frontend while providing a horizontal
 * scroll preview in the editor.
 *
 * WordPress dependencies
 */
import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import './editor.scss';
import './style.scss';

const VARIATION_NAME = 'insignia/query-carousel';

const CAROUSEL_ATTRIBUTES = {
    qcColumns: {
        type: 'object',
        default: { Desktop: 3, Tablet: 2, Mobile: 1 }
    },
    qcGaps: {
        type: 'object',
        default: { Desktop: 20, Tablet: 15, Mobile: 0 }
    },
    qcAutoplay: {
        type: 'boolean',
        default: false
    },
    qcDelay: {
        type: 'number',
        default: 3000
    },
    qcLoop: {
        type: 'boolean',
        default: true
    },
    qcShowArrows: {
        type: 'boolean',
        default: true
    },
    qcShowPagination: {
        type: 'boolean',
        default: false
    }
};

const CAROUSEL_ATTR_KEYS = Object.keys(CAROUSEL_ATTRIBUTES);

// ── 1. Register the variation ──────────────────────────────────────────────────
registerBlockVariation('core/query', {
    name: VARIATION_NAME,
    title: 'Query Carousel',
    description: 'Display posts in a carousel layout powered by Swiper.',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6H2v14a2 2 0 002 2h14v-2H4V6zm16-4H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm0 14H8V4h12v12zM9 9h2v2H9zm4 0h2v2h-2zm4 0h2v2h-2z" />
        </svg>
    ),
    attributes: {
        namespace: VARIATION_NAME,
        query: {
            perPage: 6,
            pages: 0,
            offset: 0,
            postType: 'post',
            order: 'desc',
            orderBy: 'date',
            author: '',
            search: '',
            exclude: [],
            sticky: '',
            inherit: false
        }
    },
    allowedControls: ['inherit', 'postType', 'order', 'taxQuery', 'search', 'author'],
    scope: ['inserter'],
    isActive: ['namespace'],
    innerBlocks: [
        ['core/post-template', {}, [['core/post-featured-image'], ['core/post-title']]],
        ['core/query-no-results']
    ]
});

// ── 2. Add custom attributes to core/query ──────────────────────────────────────
addFilter(
    'blocks.registerBlockType',
    'insignia/query-carousel/add-attributes',
    (settings, name) => {
        if (name !== 'core/query') {
            return settings;
        }

        const newAttributes = { ...settings.attributes };
        CAROUSEL_ATTR_KEYS.forEach(key => {
            if (!newAttributes[key]) {
                newAttributes[key] = CAROUSEL_ATTRIBUTES[key];
            }
        });

        return { ...settings, attributes: newAttributes };
    }
);

// ── 3. Determine whether the current block is a Query Carousel ──────────────────
const isQueryCarousel = props =>
    props.name === 'core/query' && props.attributes.namespace === VARIATION_NAME;

// ── 4. Add inspector controls ──────────────────────────────────────────────────
addFilter(
    'editor.BlockEdit',
    'insignia/query-carousel/add-inspector-controls',
    createHigherOrderComponent(BlockEdit => {
        return props => {
            if (!isQueryCarousel(props)) {
                return <BlockEdit {...props} />;
            }

            return (
                <>
                    <BlockEdit {...props} />
                    <Inspector {...props} />
                </>
            );
        };
    })
);

// ── 5. Apply editor classes ────────────────────────────────────────────────────
addFilter(
    'editor.BlockListBlock',
    'insignia/query-carousel/add-classes',
    createHigherOrderComponent(BlockListBlock => {
        return props => {
            if (!isQueryCarousel(props)) {
                return <BlockListBlock {...props} />;
            }

            const classes = [
                props.className,
                'insignia-query-carousel'
            ].filter(Boolean).join(' ');

            return <BlockListBlock {...props} className={classes} />;
        };
    })
);