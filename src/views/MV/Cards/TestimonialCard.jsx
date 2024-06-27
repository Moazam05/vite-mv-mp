import React from 'react'

// MUI Imports
import {Box, Card, Typography, styled, } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

function TestimonialCard({testimonial}) {
    return (
        <Wrapper>
            <FormatQuoteIcon sx={{ fontSize: '3.0rem', color: '#178F49', }} />
            <Typography sx={{ fontSize: '14px', fontWeight: '400', color: '#454545', textAlign: 'justify' }}>
                {testimonial?.testimonial}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '10px' }}>
                <img src={testimonial?.image} style={{ height: '50px', width: '50px', borderRadius: '50%' }} alt={testimonial?.name} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: '700', color: '#454545', }}>
                        {testimonial?.name}
                    </Typography>
                </Box>
            </Box>
        </Wrapper>
    )
}

const Wrapper = styled(Card)({
    width: '300px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    justifyContent: 'center', 
    gap: "15px",
    padding: '20px', 
    backgroundColor: "#fff", 
    borderRadius: '15px',
    cursor: "pointer"
})

export default TestimonialCard