import { Box, Typography, styled } from '@mui/material';
import React from 'react'

function QouteCard({ heading, data }) {
    return (
        <>
            <CardWrapper>
                <Box sx={{
                    width: '90px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start'
                }}>
                    <SubHeading>
                        {heading}
                    </SubHeading>
                </Box>

                <Box sx={{
                    backgroundColor: '#d9d9d9',
                    height: '40px',
                    width: '200px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'start',
                    paddingInline: '5px'

                }} >
                    <SubHeading>
                        {data}
                    </SubHeading>

                </Box>

            </CardWrapper>

        </>
    )
}

const CardWrapper = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    // gap: '5px'
}));
const SubHeading = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: '400',
}));


export default QouteCard