/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex, FlexItem, SearchControl, Icon, Button } from '@wordpress/components';

/**
 * ContentIcons Component
 * Displays the icon library grid with search functionality
 * @param root0
 * @param root0.searchTerm
 * @param root0.setSearchTerm
 * @param root0.filteredIcons
 * @param root0.currentIconName
 * @param root0.handleIconSelect
 */
export const ContentIcons = ( { searchTerm, setSearchTerm, filteredIcons, currentIconName, handleIconSelect } ) => {
    return (
        <>
            <Flex>
                <FlexItem>
                    <SearchControl
                        value={ searchTerm }
                        onChange={ setSearchTerm }
                        label={ __( 'Search icons', 'insignia' ) }
                        placeholder={ __( 'Search…', 'insignia' ) }
                        className="insignia-modal__search"
                        size="compact"
                    />
                </FlexItem>
            </Flex>

            { filteredIcons.length === 0 ? (
                <p>{ __( 'No icons found!', 'insignia' ) }</p>
            ) : (
                <div className="insignia-modal__icons">
                    { filteredIcons.map( iconData => (
                        <Button
                            key={ iconData.name }
                            className={ `insignia-modal__icons-button ${ currentIconName === iconData.name ? 'is-selected' : '' }` }
                            onClick={ () => handleIconSelect( iconData ) }
                        >
                            <Icon icon={ iconData.icon } size={ 32 } />
                            <span className="icon-title">{ iconData.title }</span>
                        </Button>
                    ) ) }
                </div>
            ) }
        </>
    );
};
