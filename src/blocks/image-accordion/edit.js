// import editor style
import './editor.scss';

/**
 * WordPress Dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { Fragment, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classNames from 'classnames';

/**
 * Internal Dependencies
 */
import Inspector from './inspector';

// block edit function
const Edit = props => {
    const { attributes, setAttributes, clientId, isSelected } = props;
    const { uniqueId, preset, newAccordionStatus, height, overlayColor } = attributes;

    const blockProps = useBlockProps( {
        className: classNames( uniqueId, preset ),
        style: {
            '--accordion-height': `${ height || 500 }px`,
            '--accordion-overlay': overlayColor || 'rgba(18, 100, 100, 0.6)'
        }
    } );

    const accordionRef = useRef( null );

    // accordion click behavior in editor
    useEffect( () => {
        const container = accordionRef.current;
        if ( ! container ) {
            return;
        }

        const init = () => {
            const items = container.querySelectorAll( '.wp-block-insignia-image-accordion-item' );
            if ( ! items.length ) {
                return;
            }

            items[ 0 ].classList.add( 'active' );

            items.forEach( item => {
                item.addEventListener( 'mousedown', function () {
                    items.forEach( s => s.classList.remove( 'active' ) );
                    item.classList.add( 'active' );
                } );
            } );
        };

        const timer = setTimeout( init, 300 );
        return () => clearTimeout( timer );
    }, [ newAccordionStatus ] );

    const innerBlockProps = useInnerBlocksProps(
        {
            className: 'insignia-image-accordion',
            ref: accordionRef
        },
        {
            renderAppender: false,
            allowedBlocks: [ 'insignia/image-accordion-item' ],
            template: [ [ 'insignia/image-accordion-item', {} ] ]
        }
    );

    // Append Accordion
    const childBlocks = wp.data.select( 'core/block-editor' ).getBlocks( clientId );
    const appendAccordion = () => {
        const newBlock = wp.blocks.createBlock( 'insignia/image-accordion-item', {} );
        wp.data.dispatch( 'core/block-editor' ).insertBlocks( newBlock, childBlocks.length, clientId );
    };

    return (
        <Fragment>
            { isSelected && <Inspector { ...props } /> }
            <div { ...blockProps }>
                <div { ...innerBlockProps } />
                <button
                    className="nx-append-btn"
                    onClick={ () => {
                        appendAccordion();
                        setAttributes( { newAccordionStatus: ! newAccordionStatus } );
                    } }
                >
                    { __( 'Add Item', 'nexa-blocks' ) }
                </button>
            </div>
        </Fragment>
    );
};

export default Edit;
