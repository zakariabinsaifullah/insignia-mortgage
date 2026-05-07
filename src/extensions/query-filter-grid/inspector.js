/**
 * Query Filter Grid — Inspector Controls
 *
 * Adds a Posts Per Page setting for the filter grid variation.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

import { NativeRangeControl } from '../../components';

const Inspector = props => {
    const { attributes, setAttributes } = props;
    const { qcPerPage } = attributes;

    return (
        <>
            <InspectorControls group="settings">
                <PanelBody title={__('Filter Grid Settings', 'insignia')} initialOpen={true}>
                    <NativeRangeControl
                        label={__('Posts Per Page', 'insignia')}
                        value={qcPerPage || 6}
                        onChange={value => {
                            setAttributes({
                                qcPerPage: value,
                                query: { ...attributes.query, perPage: value }
                            });
                        }}
                        min={1}
                        max={50}
                        step={1}
                    />
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;