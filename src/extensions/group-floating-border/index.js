/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BorderSettings from './controls/border-settings';

import './style.scss';

const SUPPORTED_BLOCKS = ['core/group', 'kadence/rowlayout', 'kadence/column'];

const BORDER_ATTRS = prefix => ({
    [`${prefix}Enabled`]: { type: 'boolean', default: false },
    [`${prefix}Width`]: { type: 'string', default: '' },
    [`${prefix}Height`]: { type: 'string', default: '' },
    [`${prefix}Color`]: { type: 'string', default: '' },
    [`${prefix}Top`]: { type: 'string', default: '' },
    [`${prefix}Right`]: { type: 'string', default: '' },
    [`${prefix}Bottom`]: { type: 'string', default: '' },
    [`${prefix}Left`]: { type: 'string', default: '' }
});

/**
 * Register floating border attributes on supported blocks.
 */
addFilter('blocks.registerBlockType', 'insignia/group-floating-border-add-attributes', (settings, name) => {
    if (!SUPPORTED_BLOCKS.includes(name)) {
        return settings;
    }

    return {
        ...settings,
        attributes: {
            ...settings.attributes,
            ...BORDER_ATTRS('floatingBorder1'),
            ...BORDER_ATTRS('floatingBorder2')
        }
    };
});

/**
 * Add "Floating Borders" panel to the inspector.
 */
addFilter(
    'editor.BlockEdit',
    'insignia/group-floating-border-add-inspector-controls',
    createHigherOrderComponent(BlockEdit => {
        return props => {
            const { name, attributes, setAttributes } = props;

            if (!SUPPORTED_BLOCKS.includes(name)) {
                return <BlockEdit {...props} />;
            }

            return (
                <>
                    <BlockEdit {...props} />
                    <InspectorControls>
                        <PanelBody title={__('Floating Borders', 'insignia')} initialOpen={false}>
                            <BorderSettings
                                prefix="floatingBorder1"
                                toggleLabel={__('Enable first border', 'insignia')}
                                attributes={attributes}
                                setAttributes={setAttributes}
                            />
                            <div style={{ marginTop: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '16px' }}>
                                <BorderSettings
                                    prefix="floatingBorder2"
                                    toggleLabel={__('Enable second border', 'insignia')}
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                />
                            </div>
                        </PanelBody>
                    </InspectorControls>
                </>
            );
        };
    })
);

/**
 * Apply floating border classes and CSS variables in the editor preview.
 */
addFilter(
    'editor.BlockListBlock',
    'insignia/group-floating-border-add-styles',
    createHigherOrderComponent(BlockListBlock => {
        return props => {
            const { name, attributes } = props;

            if (!SUPPORTED_BLOCKS.includes(name)) {
                return <BlockListBlock {...props} />;
            }

            const classes = [];
            const style = {};
            const fields = ['Width', 'Height', 'Color', 'Top', 'Right', 'Bottom', 'Left'];

            [
                ['floatingBorder1', 1],
                ['floatingBorder2', 2]
            ].forEach(([prefix, num]) => {
                if (!attributes[`${prefix}Enabled`]) return;
                classes.push(`has-floating-border-${num}`);
                fields.forEach(field => {
                    const val = attributes[`${prefix}${field}`];
                    if (val) {
                        style[`--fb${num}-${field.toLowerCase()}`] = val;
                    }
                });
            });

            if (!classes.length) {
                return <BlockListBlock {...props} />;
            }

            const wrapperProps = {
                ...props.wrapperProps,
                style: { ...props.wrapperProps?.style, ...style }
            };

            const className = [props.className, ...classes].filter(Boolean).join(' ');

            return <BlockListBlock {...props} className={className} wrapperProps={wrapperProps} />;
        };
    })
);
