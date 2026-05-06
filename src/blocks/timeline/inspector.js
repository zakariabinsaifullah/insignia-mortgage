import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';

const Inspector = props => {
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Timeline Settings', 'insignia')} initialOpen={true}>
                </PanelBody>
            </InspectorControls>
        </>
    );
};

export default Inspector;
