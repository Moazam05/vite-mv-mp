import React from 'react'
import { Box, Typography, styled } from '@mui/material';

function RFQCard({ heading, data }) {
    return (
        <>
            <CardWrapper>
                <HeadingWrapper >
                    <SubHeading>
                        {heading}
                    </SubHeading>
                </HeadingWrapper>

                <SubCard>
                    <SubCardHeading>
                        {data}
                    </SubCardHeading>

                </SubCard>

            </CardWrapper>

        </>
    )
}

const CardWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    // gap: '5px',
    [theme.breakpoints.down("sm")]: {
        justifyContent: 'center',
    },
}));
const HeadingWrapper = styled(Box)(({ theme }) => ({
    width: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    [theme.breakpoints.down("sm")]: {
        // justifyContent: 'start',
    },
}));
const SubCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#d9d9d9',
    height: '80px',
    width: '190px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
    padding: '8px',
    [theme.breakpoints.down("md")]: {
        width: "60%",
    },

}));
const SubHeading = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: '400',
}));
const SubCardHeading = styled(Typography)(({ theme }) => ({
    fontSize: '14px',
    fontWeight: '400',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.2',
    height: '100%',
    [theme.breakpoints.down("md")]: {
        width: '100%',
    },
}));

export default RFQCard