const listBeamElementTypes = [
    "beamWithHinges", 
    "dispBeamColumn", 
    "elasticBeamColumn", 
    "nonlinearBeamColumn"]

const listShellElementTypes = [
    "ShellMITC4",]

export function argMin(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] < r[0] ? a : r))[1];
}


export function getABS(listInput, valueTarget){
    var listAbsDiff = listInput.map(function(x) {
        return Math.abs(x - valueTarget) ;
    })
    return listAbsDiff;
}

export function formatInt(valueInt, intDigit = 5) {
    return (" ".repeat(intDigit) + valueInt.toString()).slice(-intDigit)
}

export function formatFloat(valueFloat, intDecimal = 4, intLength = 5) {
    var expandedString = (" ".repeat(intLength) + valueFloat.toFixed(intDecimal))
    return expandedString.slice(-intLength)
}


function parseTclElementLine(line) {
    let arrayInfo = line.split(/\s+/).slice(1)

    var elementType = arrayInfo[0]
    let dictInfo = {}
    if (listBeamElementTypes.includes(elementType)) {
        var int_element_number = parseInt(arrayInfo[1])
        var int_node_number_1 = parseInt(arrayInfo[2])
        var int_node_number_2 = parseInt(arrayInfo[3])
        
        dictInfo["type"] = elementType
        dictInfo["intElementNumber"] = int_element_number 
        dictInfo["listNodeNumber"] =  [int_node_number_1, int_node_number_2]
    } 
    else if (listShellElementTypes.includes(elementType)) {
        var int_element_number = parseInt(arrayInfo[1])
        var int_node_number_1 = parseInt(arrayInfo[2])
        var int_node_number_2 = parseInt(arrayInfo[3])
        var int_node_number_3 = parseInt(arrayInfo[4])
        var int_node_number_4 = parseInt(arrayInfo[5])
        
        dictInfo["type"] = elementType
        dictInfo["intElementNumber"] = int_element_number 
        dictInfo["listNodeNumber"] = [int_node_number_1, int_node_number_2, 
            int_node_number_3, int_node_number_4]
    } 
    else {
        console.log("ERROR, element type not supported")
        console.log(line)
    }


    return dictInfo
}

export function parseTcl(list_file_line) {
    // get node and elements
    var dict_parameter = {}
    var dictNodeInfo = {}
    var dictBeamElementInfo = {}
    var dictShellElementInfo = {}


    for (var i_line = 0; i_line < list_file_line.length; i_line ++) {
        let line = list_file_line[i_line]
        if (line.startsWith('model')){
            var temp_str = line.match(/-ndm\s\d*.*-/)[0]
            dict_parameter['int_ndm'] = parseInt(temp_str.slice(4,-1))
            temp_str = line.match(/-ndf\s\d*/)[0]
            dict_parameter["int_ndf"] = parseInt(temp_str.slice(4))
        }
        if (line.startsWith("node")){
            var arrayInfo = line.split(/\s+/).slice(1)
            var int_node_number = parseInt(arrayInfo[0])
            var listNodeCoord = arrayInfo.slice(1).map(function(x) {
                return parseFloat(x)
            })
            dictNodeInfo[int_node_number] = {"coordinate": listNodeCoord}
        } 
        if (line.startsWith("mass")){
            var arrayInfo = line.split(/\s+/).slice(1)
            var int_node_number = parseInt(arrayInfo[0])
            var listNodeMass = arrayInfo.slice(1).map(function(x) {
                return parseFloat(x)
            })
            dictNodeInfo[int_node_number]["directional_mass"] = listNodeMass
            dictNodeInfo[int_node_number]["mass"] 
                = (listNodeMass[0] + listNodeMass[1] + listNodeMass[2]) / 3
        }
        if (line.startsWith('element')) {
            let dictInfo = parseTclElementLine(line) 
            let int_element_number = dictInfo["intElementNumber"]
            if (dictInfo["listNodeNumber"].length == 2) {
                dictBeamElementInfo[int_element_number] = dictInfo
            }
            else if (dictInfo["listNodeNumber"].length == 4) {
                dictShellElementInfo[int_element_number] = dictInfo
            }
            // str_pattern = r'[a-z] [0-9]{1,} [0-9]{1,} [0-9]{1,}'
            // temp_str = re.findall(str_pattern, line)[0]
            // # print("debug", temp_str)
            // # temp_int_index = line.find('-mass') 
            // # if temp_int_index> 0:
            // #     line = line[:temp_int_index]
            // # temp_int_index = line.find('-rho') 
            // # if temp_int_index> 0:
            // #     line = line[:temp_int_index]
            // arrayInfo = numpy.array(temp_str.split()[1:])
            // list_element.append(arrayInfo)
        }
    // array2d_coord = numpy.array(list_node)
    // array2d_coord = array2d_coord[:,:].astype('float')
    // if len(list_element) == 0:
    //     print('No element found')
    // else:
    //     array2d_element_node = numpy.array(list_element)
    //     array2d_element_node = array2d_element_node[:,:].astype('int')
    //     for i_element in range(array2d_element_node.shape[0]):
    //         int_element_number = array2d_element_node[i_element, 0]
    //         int_node_1 = int(array2d_element_node[i_element, 1])
    //         int_node_2 = int(array2d_element_node[i_element, 2])
    //         dict_element_info[int_element_number] = [int_node_1, int_node_2]
    }
    // # array2d_coord_node1 = numpy.zeros([array2d_element_node.shape[0], 3])
    // # array2d_coord_node2 = numpy.zeros([array2d_element_node.shape[0], 3])
    // # for i_element in range(array2d_element_node.shape[0]):
    // #     int_node_1 = array2d_element_node[i_element, 1]
    // #     int_node_2 = array2d_element_node[i_element, 2]
    // #     array_cord_node_1 = None
    // #     array_cord_node_2 = None
    // #     bool_flag_coord_found = False
    // #     for i_node in range(array2d_coord.shape[0]):
    // #         if array2d_coord[i_node, 0] == int_node_1:
    // #             bool_flag_coord_found = True
    // #             array_cord_node_1 = array2d_coord[i_node,1:]
    // #         if array2d_coord[i_node, 0] == int_node_2:
    // #             bool_flag_coord_found = True
    // #             array_cord_node_2 = array2d_coord[i_node,1:]
    // #     if bool_flag_coord_found == False:
    // #         print('Error: ', 'Node not found')
    // #     array2d_coord_node1[i_element,:] =  array_cord_node_1
    // #     array2d_coord_node2[i_element,:] =  array_cord_node_2

    return [dictNodeInfo, dictBeamElementInfo, dictShellElementInfo]
}