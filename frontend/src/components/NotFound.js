import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const NotFound = () => (
	<NotFoundDiv>
		<h1>Looks like you took a wrong turn!</h1>

		<Link to="/">Take me home!</Link>
	</NotFoundDiv>
)

const NotFoundDiv = styled.div`
	padding-right: 30px;
	padding-left: 30px;
	text-align: center;
`

export default NotFound
