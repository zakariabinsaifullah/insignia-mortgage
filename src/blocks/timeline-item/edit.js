import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { RenderIcon } from '../../helpers';

const INNER_TEMPLATE = [ [ 'core/paragraph', { placeholder: 'Add content here…' } ] ];

const Edit = props => {
    const { attributes, setAttributes, isSelected } = props;
    const { iconName, customSvgCode, iconBgColor } = attributes;

    const cssCustomProperties = {
        ...( iconBgColor && { '--icon-bg': iconBgColor } )
    };

    const blockProps = useBlockProps( {
        style: cssCustomProperties
    } );

    useEffect( () => {
        setAttributes( { blockStyle: cssCustomProperties } );
    }, [ iconBgColor ] );

    const innerBlockProps = useInnerBlocksProps(
        { className: 'timeline-content' },
        {
            template: INNER_TEMPLATE,
            templateLock: false
        }
    );

    return (
        <Fragment>
            { isSelected && <Inspector { ...props } /> }
            <div { ...blockProps }>
                <div className="timeline-icon">
                    <RenderIcon customSvgCode={ customSvgCode } iconName={ iconName } size={ 48 } />
                </div>
                <div { ...innerBlockProps } />
            </div>
        </Fragment>
    );
};

export default Edit;
