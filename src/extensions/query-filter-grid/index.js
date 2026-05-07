/**
 * Query Filter Grid — Block Variation for core/query
 *
 * Adds a "Query Filter Grid" variation that displays posts in a grid layout
 * with category filtering at the top and pagination support.
 */
import { registerBlockVariation } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';

import Inspector from './inspector';
import './editor.scss';
import './style.scss';

const VARIATION_NAME = 'insignia/query-filter-grid';

const FILTER_GRID_ATTRIBUTES = {
    qcPerPage: {
        type: 'number',
        default: 6
    }
};

const ATTR_KEYS = Object.keys(FILTER_GRID_ATTRIBUTES);

registerBlockVariation('core/query', {
    name: VARIATION_NAME,
    title: 'Query Filter Grid',
    description: 'Display posts in a filterable grid with category filters and pagination.',
    category: 'insignia-blocks',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
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
        ['core/query-pagination'],
        ['core/query-no-results']
    ]
});

addFilter('blocks.registerBlockType', 'insignia/query-filter-grid/add-attributes', (settings, name) => {
    if (name !== 'core/query') {
        return settings;
    }

    const newAttributes = { ...settings.attributes };
    ATTR_KEYS.forEach(key => {
        if (!newAttributes[key]) {
            newAttributes[key] = FILTER_GRID_ATTRIBUTES[key];
        }
    });

    return { ...settings, attributes: newAttributes };
});

const isQueryFilterGrid = props => props.name === 'core/query' && props.attributes.namespace === VARIATION_NAME;

addFilter(
    'editor.BlockEdit',
    'insignia/query-filter-grid/add-inspector-controls',
    createHigherOrderComponent(BlockEdit => {
        return props => {
            if (!isQueryFilterGrid(props)) {
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

addFilter(
    'editor.BlockListBlock',
    'insignia/query-filter-grid/add-classes',
    createHigherOrderComponent(BlockListBlock => {
        return props => {
            if (!isQueryFilterGrid(props)) {
                return <BlockListBlock {...props} />;
            }

            const classes = [props.className, 'insignia-query-filter-grid'].filter(Boolean).join(' ');

            return <BlockListBlock {...props} className={classes} />;
        };
    })
);